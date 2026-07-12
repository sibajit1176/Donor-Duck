const Charity = require("../models/charity");
const CharityProject = require("../models/charityProject");
const Donation = require("../models/donationhitoryTable");
const User = require("../models/user");
const { fn, col,literal } = require("sequelize");


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


module.exports = {
    registercharityService,
    getCharityProfileService,
    editCharityProfileService,
    deleteCharityProfileService,
    getAllCharityService,
    getCharityProfilfullDetailseService
}