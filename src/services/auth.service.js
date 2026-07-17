const { generateAccessToken, generaterefreshtoken, verifyRefreshToken } = require("../helpers/jwt")
const Donation = require("../models/donationhitoryTable")
const User = require("../models/user")
const bcrypt = require('bcrypt')
const { fn, col } = require("sequelize");
const redisClient = require("../config/redis");
const transporter = require("../config/nodemailer");

const generateResetToken = require("../utils/generateToken");
const forgotPasswordTemplate = require("../utils/emailTemplate");
const Charity = require("../models/charity");
const CharityProject = require("../models/charityProject");

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

    // Donation Statistics

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

    // Donation History

    const donationHistory = await Donation.findAll({

        where: {
            userId,
        },

        include: [
            {
                model: Charity,
                as: "charity",
                attributes: [
                    "organizationName",
                ],
            },
            {
                model: CharityProject,
                as: "project",
                attributes: [
                    "title", // or "projectName" according to your model
                ],
            },
        ],

        attributes: [
            "id",
            "orderId",
            "amount",
            "status",
            "createdAt",
        ],

        order: [
            ["createdAt", "DESC"],
        ],

    });

    return {

        message: "Profile fetched successfully.",

        user,

        donationStats,

        donations: donationHistory.map((item) => ({

            id: item.id,

            orderId: item.orderId,

            charityName:
                item.charity?.organizationName,

            projectName:
                item.project?.title, // change to projectName if needed

            amount: Number(item.amount),

            status: item.status,

            paymentTime: item.createdAt,

        })),

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
const forgotPasswordService = async (email) => {

    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {

        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;

    }

    // Generate 6-digit OTP

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    // Store OTP in Redis for 10 minutes

    await redisClient.set(
        `forgot-password:${email}`,
        otp,
        {
            EX: 600,
        }
    );

    // Send OTP email

    await transporter.sendMail({

        from: process.env.MAIL_USER,

        to: email,

        subject: "Password Reset OTP",

        html: forgotPasswordTemplate.forgotPasswordTemplate(
            user.name,
            otp
        ),

    });

    return {

        message: "OTP sent successfully to your email.",

    };

};
const verifyOtpService = async (payload) => {

    const {
        email,
        otp,
    } = payload;

    if (!email || !otp) {

        const error = new Error(
            "Email and OTP are required."
        );

        error.statusCode = 400;

        throw error;

    }

    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {

        const error = new Error(
            "User not found."
        );

        error.statusCode = 404;

        throw error;

    }

    const savedOtp =
        await redisClient.get(
            `forgot-password:${email}`
        );

    if (!savedOtp) {

        const error = new Error(
            "OTP expired. Please request a new OTP."
        );

        error.statusCode = 400;

        throw error;

    }

    if (savedOtp !== otp) {

        const error = new Error(
            "Invalid OTP."
        );

        error.statusCode = 400;

        throw error;

    }

    // OTP verified successfully

    await redisClient.del(
        `forgot-password:${email}`
    );

    // Store verification flag for reset password

    await redisClient.set(
        `reset-password:${email}`,
        "verified",
        {
            EX: 600,
        }
    );

    return {

        success: true,

        message:
            "OTP verified successfully.",

    };

};
const resetPasswordService = async (payload) => {

    const {
        email,
        password,
    } = payload;

    if (!email || !password) {

        const error = new Error(
            "Email and password are required."
        );

        error.statusCode = 400;

        throw error;

    }

    if (password.length < 8) {

        const error = new Error(
            "Password must be at least 8 characters long."
        );

        error.statusCode = 400;

        throw error;

    }

    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {

        const error = new Error(
            "User not found."
        );

        error.statusCode = 404;

        throw error;

    }

    // Check OTP verification

    const verified = await redisClient.get(
        `reset-password:${email}`
    );

    if (!verified) {

        const error = new Error(
            "OTP verification required or expired."
        );

        error.statusCode = 401;

        throw error;

    }

    // Prevent using same password

    const isSamePassword = await bcrypt.compare(
        password,
        user.password
    );

    if (isSamePassword) {

        const error = new Error(
            "New password cannot be the same as your current password."
        );

        error.statusCode = 400;

        throw error;

    }

    // Hash password

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    // Update password

    await user.update({
        password: hashedPassword,
    });

    // Remove Redis verification key

    await redisClient.del(
        `reset-password:${email}`
    );

    return {

        success: true,

        message:
            "Password reset successfully. Please login with your new password.",

    };

};
const verifyEmailOtp = async (email) => {

    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {

        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;

    }

    // Generate 6-digit OTP

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    // Store OTP in Redis for 10 minutes

    await redisClient.set(
        `verify-email:${email}`,
        otp,
        {
            EX: 600,
        }
    );

    // Send OTP email

    await transporter.sendMail({

        from: process.env.MAIL_USER,

        to: email,

        subject: "Email varify",

        html: forgotPasswordTemplate.verifyEmailTemplate(
            user.name,
            otp
        ),

    });

    return {

        message: "OTP sent successfully to your email.",

    };

};
const verifyEmailService = async (payload) => {

    const {
        email,
        otp,
    } = payload;

    if (!email || !otp) {

        const error = new Error(
            "Email and OTP are required."
        );

        error.statusCode = 400;

        throw error;

    }

    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) {

        const error = new Error(
            "User not found."
        );

        error.statusCode = 404;

        throw error;

    }

    const savedOtp =
        await redisClient.get(
            `verify-email:${email}`
        );

    if (!savedOtp) {

        const error = new Error(
            "OTP expired. Please request a new OTP."
        );

        error.statusCode = 400;

        throw error;

    }

    if (savedOtp !== otp) {

        const error = new Error(
            "Invalid OTP."
        );

        error.statusCode = 400;

        throw error;

    }

    // OTP verified successfully

    await redisClient.del(
        `verify-email:${email}`
    );

    // Store verification flag for reset password

    await redisClient.set(
        `verify-email:${email}`,
        "verified",
        {
            EX: 600,
        }
    );

    await user.update({
        isVerified:true
    })

    return {

        success: true,

        message:
            "Email verified successfully.",

    };

};

const changePassword = async (payload) => {

    const {
        password,
        newPassword,
        id,
    } = payload;

    const user = await User.findByPk(id);

    if (!user) {

        const error = new Error("User not found.");

        error.statusCode = 404;

        throw error;

    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatched) {

        const error = new Error(
            "Current password is incorrect."
        );

        error.statusCode = 401;

        throw error;

    }

    const isSamePassword = await bcrypt.compare(
        newPassword,
        user.password
    );

    if (isSamePassword) {

        const error = new Error(
            "New password cannot be the same as the current password."
        );

        error.statusCode = 400;

        throw error;

    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    await user.update({
        password: hashedPassword,
    });

    return {
        message: "Password updated successfully.",
    };

};

module.exports = {
    registerService,
    loggingService,
    refreshTokenService,
    logoutService,
    getProfileDetailsService,
    editProfileDetailsService,
    forgotPasswordService,
    verifyOtpService,
    resetPasswordService,
    verifyEmailOtp,
    verifyEmailService,
    changePassword
}