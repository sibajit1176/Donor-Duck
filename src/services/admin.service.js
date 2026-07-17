const CharityProject = require("../models/charityProject")
const Donation = require("../models/donationhitoryTable");
const Charity = require("../models/charity");
const User = require("../models/user");
const { Op, fn, col, Sequelize } = require("sequelize");
const sequelize = require("../config/database");


const getAllCharity = async () => {
    const charities = await Charity.findAll({
        include: [
            {
                model: User,
                as: "approver",
                attributes: ["id", "name"],
                required: false,
            },
        ],
        order: [
            [
                Sequelize.literal(`
                    CASE
                        WHEN approvalStatus = 'PENDING' THEN 0
                        ELSE 1
                    END
                `),
                "ASC",
            ],
            ["createdAt", "DESC"],
        ],
    });

    return {
        message: "Get all charities",
        charities,
    };
};

const getAllUsers = async () => {

    const users = await User.findAll({
        order: [["createdAt", "DESC"]],
    });

    return {
        message: "Users fetched successfully.",
        users,
    };
};

const updateCharityStatus = async (payload) => {
    const {
        id,
        approvedBy,
        approvalStatus,
        rejectionReason,
    } = payload;

    if (!["APPROVED", "REJECTED"].includes(approvalStatus)) {
        const error = new Error("Invalid approval status.");
        error.statusCode = 400;
        throw error;
    }

    if (
        approvalStatus === "REJECTED" &&
        (!rejectionReason || !rejectionReason.trim())
    ) {
        const error = new Error(
            "Rejection reason is required."
        );
        error.statusCode = 400;
        throw error;
    }

    const transaction = await sequelize.transaction();

    try {
        const charity = await Charity.findByPk(id, {
            transaction,
        });

        if (!charity) {
            const error = new Error("Charity not found.");
            error.statusCode = 404;
            throw error;
        }

        await charity.update(
            {
                approvalStatus,
                approvedBy,
                approvedAt: new Date(),
                rejectionReason:
                    approvalStatus === "REJECTED"
                        ? rejectionReason
                        : null,
            },
            { transaction }
        );

        await User.update(
            {
                role:
                    approvalStatus === "APPROVED"
                        ? "CHARITY"
                        : "USER",
            },
            {
                where: {
                    id: charity.userId,
                },
                transaction,
            }
        );

        await transaction.commit();

        return {
            success: true,
            message: `Charity ${approvalStatus.toLowerCase()} successfully.`,
            charity,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const blockUser = async (payload) => {

    const { id, status, reason } = payload;

    const user = await User.findByPk(id);

    if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
    }

    if (!["ACTIVE", "BLOCKED"].includes(status)) {
        const error = new Error("Invalid user status.");
        error.statusCode = 400;
        throw error;
    }

    await user.update({
        status,
        reason
    });

    return {
        message: `${user.name} account has been ${status.toLowerCase()}.`,
    };
};

const adminDashBoardService = async () => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
        totalUsers,
        activeUsers,
        totalCharities,
        pendingCharitiesCount,
        totalProjects,
        activeProjects,
        totalDonationAmount,
        todayDonationAmount,
        monthlyDonationChart,
        recentDonations,
        recentUsers,
        pendingCharities,
    ] = await Promise.all([

        // ================= Statistics =================

        User.count(),

        User.count({
            where: {
                status: "ACTIVE",
            },
        }),

        Charity.count(),

        Charity.count({
            where: {
                approvalStatus: "PENDING",
            },
        }),

        CharityProject.count(),

        CharityProject.count({
            where: {
                status: "ACTIVE",
            },
        }),

        Donation.sum("amount", {
            where: {
                status: "SUCCESS",
            },
        }),

        Donation.sum("amount", {
            where: {
                status: "SUCCESS",
                createdAt: {
                    [Op.gte]: today,
                },
            },
        }),

        // ================= Monthly Donation Chart =================

        Donation.findAll({
            where: {
                status: "SUCCESS",
            },
            attributes: [
                [fn("MONTH", col("createdAt")), "month"],
                [fn("SUM", col("amount")), "amount"],
            ],
            group: [fn("MONTH", col("createdAt"))],
            order: [[fn("MONTH", col("createdAt")), "ASC"]],
            raw: true,
        }),

        // ================= Recent Donations =================

        Donation.findAll({
            where: {
                status: "SUCCESS",
            },
            limit: 5,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["name"],
                },
                {
                    model: Charity,
                    as: "charity",
                    attributes: ["organizationName"],
                },
                {
                    model: CharityProject,
                    as: "project",
                    attributes: ["title"],
                },
            ],
            attributes: [
                "id",
                "orderId",
                "amount",
                "status",
                "createdAt",
            ],
        }),
        // ================= Recent Users =================

        User.findAll({
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: [
                "id",
                "name",
                "email",
                "role",
                "status",
                "createdAt",
            ],
        }),

        // ================= Pending Charities =================

        Charity.findAll({
            where: {
                approvalStatus: "PENDING",
            },
            limit: 5,
            order: [["createdAt", "DESC"]],
            attributes: [
                "id",
                "organizationName",
                "registrationNumber",
                "createdAt",
            ],
        }),

    ]);

    // ================= Chart Formatting =================

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const chartData = months.map((month, index) => {

        const record = monthlyDonationChart.find(
            (item) => Number(item.month) === index + 1
        );

        return {
            month,
            amount: record ? Number(record.amount) : 0,
        };
    });

    // ================= Response =================

    return {

        statistics: {

            totalUsers,

            activeUsers,

            totalCharities,

            pendingCharities: pendingCharitiesCount,

            totalProjects,

            activeProjects,

            totalDonationAmount: Number(totalDonationAmount) || 0,

            todayDonation: Number(todayDonationAmount) || 0,

        },

        chartData,

        recentDonations: recentDonations.map((item) => ({
            id: item.id,
            orderId: item.orderId,
            donorName: item.user?.name,
            organizationName: item.charity?.organizationName,
            projectName: item.project?.title,
            amount: Number(item.amount),
            status: item.status,
            createdAt: item.createdAt,
        })),
        recentUsers,

        pendingCharities,

    };
};

const showAllDonation = async () => {

    const [
        donationHistory,
        totalDonations,
        totalAmount,
        success,
        pending,
        failed,
        refunded,
    ] = await Promise.all([

        Donation.findAll({

            include: [

                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "name",
                        "email",
                    ],
                },

                {
                    model: Charity,
                    as: "charity",
                    attributes: [
                        "id",
                        "organizationName",
                    ],
                },

                {
                    model: CharityProject,
                    as: "project",
                    attributes: [
                        "id",
                        "title",
                    ],
                },

            ],

            order: [["createdAt", "DESC"]],

        }),

        Donation.count(),

        Donation.sum("amount", {
            where: {
                status: "SUCCESS",
            },
        }),

        Donation.count({
            where: {
                status: "SUCCESS",
            },
        }),

        Donation.count({
            where: {
                status: "PENDING",
            },
        }),

        Donation.count({
            where: {
                status: "FAILED",
            },
        }),

        Donation.count({
            where: {
                status: "REFUNDED",
            },
        }),

    ]);

    return {

        statistics: {

            totalDonations,

            totalAmount: Number(totalAmount) || 0,

            success,

            pending,

            failed,

            refunded,

        },

        donations: donationHistory.map((item) => ({

            id: item.id,

            orderId: item.orderId,

            donorName: item.user?.name,

            donorEmail: item.user?.email,

            organizationName:
                item.charity?.organizationName,

            projectName:
                item.project?.title,

            amount: Number(item.amount),

            message: item.message,

            isAnonymous: item.isAnonymous,

            status: item.status,

            createdAt: item.createdAt,

        })),

    };

};
module.exports = {
    blockUser,
    updateCharityStatus,
    getAllUsers,
    getAllCharity,
    adminDashBoardService,
    showAllDonation
}