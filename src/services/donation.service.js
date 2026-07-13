const cashfree = require("../config/cashfree");
const sequelize = require("../config/database");
const Charity = require("../models/charity");
const CharityProject = require("../models/charityProject");
const Donation = require("../models/donationhitoryTable");
const User = require("../models/user");

const createDonationService = async (payload) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            userId,
            charityId,
            projectId,
            amount,
            message,
        } = payload;

        const user = await User.findByPk(userId);

        if (!user) {
            const err = new Error("User not found.");
            err.statusCode = 404;
            throw err;
        }

        const charity = await Charity.findByPk(charityId);

        if (!charity) {
            const err = new Error("Charity not found.");
            err.statusCode = 404;
            throw err;
        }

        const project = await CharityProject.findOne({
            where: {
                id: projectId,
                charityId,
            },
        });

        if (!project) {
            const err = new Error("Project not found or inactive.");
            err.statusCode = 404;
            throw err;
        }
        const orderId = `ORDER_${Date.now()}_${userId.slice(0, 8)}`;
        console.log(orderId);

        await Donation.create(
            {
                orderId,
                userId,
                charityId,
                projectId,
                amount,
                message,
                status: "PENDING",
            },
            { transaction }
        );

        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 30);

        const request = {
            order_id: orderId,
            order_amount: amount,
            order_currency: "INR",
            customer_details: {
                customer_id: user.id,
                customer_phone: user.phone,
            },
            order_meta: {
                return_url:
                    "http://localhost:5173/paymentStatus/{order_id}",
            },
            order_expiry_time: expiryDate.toISOString(),
        };

        const response = await cashfree.PGCreateOrder(request);

        await transaction.commit();

        return {
            message: "Donation created successfully.",
            orderId,
            paymentSessionId: response.data.payment_session_id,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const verifyPaymentService = async (payload) => {
    const {orderId } = payload;

    const transaction = await sequelize.transaction();

    try {
        const donation = await Donation.findOne({
            where: {
                orderId,
            },
            include: [
                {
                    model: CharityProject,
                    as: "project",
                    attributes: ["title"],
                },
                {
                    model: Charity,
                    as: "charity",
                    attributes: ["organizationName"],
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["name"],
                },
            ],
            transaction,
        });

        if (!donation) {
            const err = new Error("Donation not found.");
            err.statusCode = 404;
            throw err;
        }

        const response = await cashfree.PGFetchOrder(orderId);

        if (!response.data) {
            const err = new Error("Unable to verify payment.");
            err.statusCode = 400;
            throw err;
        }

        const paymentStatus = response.data.order_status;

        if (paymentStatus !== "PAID") {
            await donation.update(
                {
                    status: "FAILED",
                },
                { transaction }
            );

            await transaction.commit();

            return {
                success: false,
                message: "Payment not completed.",
            };
        }

        await donation.update(
            {
                status: "SUCCESS",
            },
            { transaction }
        );

        const project = await CharityProject.findByPk(
            donation.projectId,
            { transaction }
        );

        await project.update(
            {
                raisedAmount:
                    Number(project.raisedAmount) +
                    Number(donation.amount),
                totalDonors: Number(project.totalDonors) + 1
            },
            { transaction }
        );
        const charity = await Charity.findByPk(
            donation.charityId,
            { transaction }
        );

        await charity.update(
            {
                currentAmount:
                    Number(charity.currentAmount) +
                    Number(donation.amount),
            },
            { transaction }
        );

        await transaction.commit();

        return {
            success: true,
            message: "Payment verified successfully.",
            payment: {
                status: donation.status,
                orderId: donation.orderId,
                amount: donation.amount,
                message: donation.message,
                createdAt: donation.createdAt,
                projectTitle: donation.project.title,
                organizationName: donation.charity.organizationName,
                donorName: donation.user.name,
            },
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getUserPaymentService = async (payload) => {
    const { userId } = payload;

    const paymentHistory = await Donation.findAll({
        where: {
            userId,
        },
        attributes: [
            "id",
            "orderId",
            "amount",
            "message",
            "isAnonymous",
            "status",
            "createdAt",
        ],
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "name"],
            },
            {
                model: Charity,
                as: "charity",
                attributes: ["id", "organizationName"],
            },
            {
                model: CharityProject,
                as: "project",
                attributes: ["id", "title"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    return {
        message: "Payment history fetched successfully.",
        data: paymentHistory,
    };
};

const getCharityPaymentService = async (payload) => {
    const { userId } = payload;

    const charity = await Charity.findOne({
        where: { userId },
    });

    if (!charity) {
        const err = new Error("Charity not found.");
        err.statusCode = 404;
        throw err;
    }

    const paymentHistory = await Donation.findAll({
        where: {
            charityId: charity.id,
        },
        attributes: [
            "id",
            "orderId",
            "amount",
            "message",
            "isAnonymous",
            "status",
            "createdAt",
        ],
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "name"],
            },
            {
                model: CharityProject,
                as: "project",
                attributes: ["id", "title"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    return {
        message: "Payment history fetched successfully.",
        data: paymentHistory,
    };
};

module.exports = {
    createDonationService,
    verifyPaymentService,
    getUserPaymentService,
    getCharityPaymentService
};