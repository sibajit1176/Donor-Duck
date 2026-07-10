const Charity = require("../models/charity");
const User = require("../models/user");

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

module.exports = {
    registercharityService,
    getCharityProfileService,
    editCharityProfileService,
    deleteCharityProfileService
}