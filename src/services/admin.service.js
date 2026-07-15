const CharityProject = require("../models/charityProject")
const Donation = require("../models/donationhitoryTable");
const Charity = require("../models/charity");
const User = require("../models/user");
const { Op, fn, col, Sequelize } = require("sequelize");

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

    const charity = await Charity.findByPk(id);

    if (!charity) {
        const error = new Error("Charity not found.");
        error.statusCode = 404;
        throw error;
    }

    if (!["APPROVED", "REJECTED"].includes(approvalStatus)) {
        const error = new Error("Invalid approval status.");
        error.statusCode = 400;
        throw error;
    }

    await charity.update({
        approvalStatus,
        approvedBy,
        approvedAt: new Date(),
        rejectionReason:
            approvalStatus === "REJECTED"
                ? rejectionReason
                : null,
    });

    return {
        message: `Charity ${approvalStatus.toLowerCase()} successfully.`,
    };
};

const blockUser = async (payload) => {

    const { id, status ,reason} = payload;

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
            donorName: item.user.name,
            organizationName: item.charity.organizationName,
            amount: Number(item.amount),
            status: item.status,
            createdAt: item.createdAt,
        })),

        recentUsers,

        pendingCharities,

    };
};

module.exports={
    blockUser,
    updateCharityStatus,
    getAllUsers,
    getAllCharity,
    adminDashBoardService
}