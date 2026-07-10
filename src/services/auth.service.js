const { generateAccessToken, generaterefreshtoken, verifyRefreshToken } = require("../helpers/jwt")
const Donation = require("../models/donationhitoryTable")
const User = require("../models/user")
const bcrypt = require('bcrypt')
const { fn, col } = require("sequelize");

const registerService = async (userDetails) => {
    const { name, email, password } = userDetails
    const userExist = await User.findOne({
        where: {
            email
        }
    })
    if (userExist) {
        const err = new Error("Email already exists")
        err.statusCode = 409;
        throw err
    }
    const hashpassword = await bcrypt.hash(password, 10)

    const createUser = await User.create({
        name,
        email,
        password: hashpassword,
    })
    return {
        message: `${createUser.name} registered successfully`,
    }
}

const loggingService = async (usercredentials) => {
    const { email, password } = usercredentials
    const userExist = await User.findOne({
        where: {
            email
        }
    })
    if (!userExist) {
        const err = new Error(`${email} not exists`)
        err.statusCode = 401;
        throw err
    }

    const validPassword = await bcrypt.compare(password, userExist.password)
    if (!validPassword) {
        const err = new Error("Incorect credentials")
        err.statusCode = 401;
        throw err
    }
    if (userExist.status !== "ACTIVE") {
        return res.status(403).json({
            success: false,
            message: "Account is inactive."
        });
    }
    const payload = {
        name: userExist.name,
        email: userExist.email,
        id: userExist.id,
        role: userExist.role
    }

    const accesstoken = generateAccessToken(payload)
    const refreshtoken = generaterefreshtoken(payload)

    return {
        message: `login succed`,
        accesstoken,
        refreshtoken
    }
}

const refreshTokenService = async (refToken) => {
    if (!refToken) {
        const error = new Error("Refresh token is required");
        error.statusCode = 401;
        throw error;
    }
    const decoded = verifyRefreshToken(refToken)
    const user = await User.findByPk(decoded.id)
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 401;
        throw error;
    }
    const payload = {
        name: user.name,
        email: user.email,
        id: user.id,
        role: user.role
    }
    const accessstoken = generateAccessToken(payload)

    return {
        accessstoken
    }
}

const logoutService = async () => {
    return {
        message: "Logout successful."
    };
};

const getProfileDetailsService = async (payload) => {
    const { userId } = payload;

    const user = await User.findByPk(userId, {
        attributes: {
            exclude: ["password", "status"],
        },
    });

    if (!user) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        throw err;
    }
    const donationStats = await Donation.findOne({
        where: {
            userId,
        },
        attributes: [
            [fn("COALESCE", fn("SUM", col("amount")), 0), "totalAmount"],
            [fn("COUNT", col("id")), "totalDonations"],
            [fn("COUNT", fn("DISTINCT", col("charityId"))), "totalCharities"],
            [fn("COUNT", fn("DISTINCT", col("projectId"))), "totalProjects"],
        ],
        raw: true,
    });
    return {
        message: "Profile fetched successfully.",
        user,
        donationStats
    };
};
const editProfileDetailsService = async (payload) => {
    const { userId, name, email, phone, address,city,state,country,linkedInProfile,twiterProfile } = payload;

    const user = await User.findByPk(userId);

    if (!user) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        throw err;
    }

    // Check if email already exists for another user
    if (email && email !== user.email) {
        const emailExists = await User.findOne({
            where: { email },
        });

        if (emailExists) {
            const err = new Error("Email already exists.");
            err.statusCode = 409;
            throw err;
        }
    }

   const result = await user.update({
        name,
        email,
        phone,
        twiterProfile,
        linkedInProfile,
        country,
        state,
        city,
        address
    });

    return {
        message: "Profile updated successfully.",
        updatedData:result
    };
};
module.exports = {
    registerService,
    loggingService,
    refreshTokenService,
    logoutService,
    getProfileDetailsService,
    editProfileDetailsService
}