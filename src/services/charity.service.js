const Charity = require("../models/charity");
const CharityProject = require("../models/charityProject");
const Donation = require("../models/donationhitoryTable");
const User = require("../models/user");
const { fn, col,literal,Sequelize,Op } = require("sequelize");


const registercharityService = async (payload) => {
    const {
        userId,
        organizationName,
        registrationNumber,
        description,
        category,
        website,
        logo,
        } = payload;

    const charityExist = await Charity.findOne({
        where: {
            userId
        }
    })
    if (charityExist) {
        const err = new Error("You have already registered a charity.");
        err.statusCode = 409;
        throw err;
    }
    const registercharity = await Charity.findOne({
        where: {
            registrationNumber
        }
    })
    if (registercharity) {
        const err = new Error("Registration number already exists.");
        err.statusCode = 409;
        throw err;
    }

    const charitycreate = await Charity.create({
       userId,
        organizationName,
        registrationNumber,
        description,
        category,
        website,
        logo,
        approvalStatus: "PENDING"
    });
    return {
        message: "Charity registration submitted successfully."
    }
}

const getCharityProfileService = async (userId) => {
    const charityProfile = await Charity.findOne({
        where: { userId },
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "name", "email"]
            }
        ],
        attributes: [
            "id",
            "organizationName",
            "registrationNumber",
            "description",
            "mission",
            "vision",
            "category",
            "website",
            "phone",
            "address",
            "city",
            "state",
            "country",
            "logo",
            "coverImage",
            "goalAmount",
            "currentAmount",
            "approvalStatus",
            "createdAt"
        ]
    });

    if (!charityProfile) {
        const err = new Error("Charity profile not found.");
        err.statusCode = 404;
        throw err;
    }

    return {
        message:"get charity profile",
        charityProfile
    };
};

const editCharityProfileService = async (payload) => {
    const { userId, ...updateData } = payload;

    const charityProfile = await Charity.findOne({
        where: { userId }
    });

    if (!charityProfile) {
        const err = new Error("Charity profile not found.");
        err.statusCode = 404;
        throw err;
    }

    await charityProfile.update(updateData);

    return {
        message: "Profile updated successfully.",
        data: charityProfile
    };
};

const deleteCharityProfileService = async (userId) => {
    const charityProfile = await Charity.findOne({
        where: { userId },
    });

    if (!charityProfile) {
        const error = new Error("Charity profile not found.");
        error.statusCode = 404;
        throw error;
    }

    await charityProfile.destroy();

    return {
        message: "Charity profile deleted successfully.",
    };
};

const getAllCharityService = async () => {
    const charities = await Charity.findAll({
        where: {
            approvalStatus: "APPROVED",
        },
        attributes: [
            "id",
            "organizationName",
            "category",
            "description",
            "coverImage",
            [
                fn("COUNT", col("projects.id")),
                "totalProjects",
            ],
        ],
        include: [
            {
                model: CharityProject,
                as: "projects",
                attributes: [],
                required: false,
            },
        ],
        group: ["Charity.id"],
        order: [["createdAt", "DESC"]],
    });

    return {
        message: "Charities fetched successfully.",
        charities,
    };
};

const getCharityProfilfullDetailseService = async (userId) => {

    const charity = await Charity.findOne({
        where: { userId },
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "name", "email"],
            },
        ],
    });

    if (!charity) {
        const err = new Error("Charity profile not found.");
        err.statusCode = 404;
        throw err;
    }

    const charityId = charity.id;

    const [stats, projects, donations] = await Promise.all([

        // ---------- Statistics ----------
        Promise.all([

            CharityProject.count({
                where: {
                    charityId,
                },
            }),

            CharityProject.count({
                where: {
                    charityId,
                    status: "ACTIVE",
                },
            }),

            CharityProject.count({
                where: {
                    charityId,
                    status: "COMPLETED",
                },
            }),

            Donation.findOne({
                where: {
                    charityId,
                    status:"SUCCESS"
                },
                attributes: [
                    [
                        fn("COUNT", col("id")),
                        "totalDonations",
                    ],
                    [
                        fn(
                            "COALESCE",
                            fn("SUM", col("amount")),
                            0
                        ),
                        "totalRaised",
                    ],
                ],
                raw: true,
            }),

        ]),

        // ---------- Projects ----------
        CharityProject.findAll({
            where: {
                charityId,
            },
            order: [["createdAt", "DESC"]],
        }),

        // ---------- Donations ----------
        Donation.findAll({
            where: {
                charityId,
                status:"SUCCESS"
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: CharityProject,
                    as: "project",
                    attributes: ["id", "title"],
                },
            ],
            order: [["createdAt", "DESC"]],
        }),

    ]);

    const [
        totalProjects,
        activeProjects,
        completedProjects,
        donationStats,
    ] = stats;

    return {
        message: "Charity profile fetched successfully.",

        charity,

        stats: {
            totalProjects,
            activeProjects,
            completedProjects,
            totalDonations: Number(donationStats.totalDonations),
            totalRaised: Number(donationStats.totalRaised),
        },

        projects,

        donations,
    };

};

const getCharityProfileServiceForAllUser = async (id) => {

    const charity = await Charity.findOne({

        where: { id },

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
        ],

    });

    if (!charity) {

        const err = new Error("Charity profile not found.");
        err.statusCode = 404;
        throw err;

    }

    const [

        totalProjects,

        activeProjects,

        totalDonors,

        totalDonations,

        totalRaised,

        projects,

        donations,

        projectDonationTotals,

    ] = await Promise.all([

        CharityProject.count({
            where: {
                charityId: id,
            },
        }),

        CharityProject.count({
            where: {
                charityId: id,
                status: "ACTIVE",
            },
        }),

        Donation.count({
            where: {
                charityId: id,
                status: "SUCCESS",
            },
            distinct: true,
            col: "userId",
        }),

        Donation.count({
            where: {
                charityId: id,
                status: "SUCCESS",
            },
        }),

        Donation.sum("amount", {
            where: {
                charityId: id,
                status: "SUCCESS",
            },
        }),

        CharityProject.findAll({

            where: {
                charityId: id,
            },

            attributes: [
                "id",
                "title",
                "description",
                "goalAmount",
                "coverImage",
                "status",
                "totalDonors"
            ],

            order: [
                ["createdAt", "DESC"],
            ],

        }),

        Donation.findAll({

            where: {
                charityId: id,
                status: "SUCCESS",
            },

            include: [

                {
                    model: User,
                    as: "user",
                    attributes: [
                        "name",
                    ],
                },

                {
                    model: CharityProject,
                    as: "project",
                    attributes: [
                        "title",
                    ],
                },

            ],

            attributes: [
                "id",
                "amount",
                "message",
                "isAnonymous",
                "createdAt",
            ],

            order: [
                ["createdAt", "DESC"],
            ],

            limit: 10,

        }),

        Donation.findAll({

            where: {
                charityId: id,
                status: "SUCCESS",
            },

            attributes: [
                "projectId",
                [
                    Sequelize.fn(
                        "SUM",
                        Sequelize.col("amount")
                    ),
                    "raisedAmount",
                ],
            ],

            group: ["projectId"],

            raw: true,

        }),

    ]);

    const totalRaisedAmount = Number(totalRaised) || 0;

    const raisedAmountMap = {};

    projectDonationTotals.forEach((item) => {

        raisedAmountMap[item.projectId] =
            Number(item.raisedAmount) || 0;

    });

    return {

        message: "Charity details fetched successfully.",

        charity: {

            id: charity.id,

            organizationName: charity.organizationName,

            description: charity.description,

            mission: charity.mission,

            vision: charity.vision,

            logo: charity.logo,

            banner: charity.coverImage,

            email: charity.user?.email,

            phone: charity.phone,

            website: charity.website,

            address: [
                charity.address,
                charity.city,
                charity.state,
                charity.country,
            ]
                .filter(Boolean)
                .join(", "),

            registrationNumber:
                charity.registrationNumber,

            foundedYear:
                new Date(charity.createdAt).getFullYear(),

            isVerified:
                charity.approvalStatus === "APPROVED",

        },

        statistics: {

            totalProjects,

            activeProjects,

            totalDonors,

            totalDonations,

            totalRaised: totalRaisedAmount,

            goalAmount:
                Number(charity.goalAmount) || 0,

            progressPercentage:
                charity.goalAmount > 0
                    ? Number(
                          (
                              (totalRaisedAmount /
                                  Number(
                                      charity.goalAmount
                                  )) *
                              100
                          ).toFixed(2)
                      )
                    : 0,

        },

        projects: projects.map((project) => ({

            id: project.id,

            title: project.title,

            description: project.description,

            goalAmount: Number(project.goalAmount),

            raisedAmount:
                raisedAmountMap[project.id] || 0,

            image: project.coverImage,

            status: project.status,

            totalDonors:project.totalDonors

        })),

        donations: donations.map((donation) => ({

            id: donation.id,

            donorName: donation.isAnonymous
                ? "Anonymous"
                : donation.user?.name,

            amount: Number(donation.amount),

            projectName:
                donation.project?.title,

            message: donation.message,

            createdAt: donation.createdAt,

        })),

    };

};
const uploadCharitylogoService = async (payload) => {

    const {
        userId,
        logo,
    } = payload;

    const charityProfile = await Charity.findOne({
        where: { userId }
    });

    if (!charityProfile) {
        const err = new Error("Charity profile not found.");
        err.statusCode = 404;
        throw err;
    }

    await charityProfile.update({
        logo,
    });

    return {
        success: true,
        message: "Logo updated successfully.",
        logo,
    };
};

const uploadCharityCoverImageService = async (payload) => {

    const {
        userId,
        coverImage,
    } = payload;

    const charityProfile = await Charity.findOne({
        where: { userId }
    });

    if (!charityProfile) {
        const err = new Error("Charity profile not found.");
        err.statusCode = 404;
        throw err;
    }

    await charityProfile.update({
        coverImage,
    });

    return {
        success: true,
        message: "Logo updated successfully.",
        coverImage,
    };
};


module.exports = {
    registercharityService,
    getCharityProfileService,
    editCharityProfileService,
    deleteCharityProfileService,
    getAllCharityService,
    getCharityProfilfullDetailseService,
    getCharityProfileServiceForAllUser,
    uploadCharityCoverImageService,
    uploadCharitylogoService
}