const authService = require('../services/auth.service')

const registerController =async (req, res, next) => {
    try {
        const createuser =await authService.registerService(req.body)
        res.status(201).send(createuser)
    } catch (error) {
        next(error)
    }
}

const logincontroller=async(req,res,next)=>{
    try {
        const result=await authService.loggingService(req.body)
        res.cookie("refreshToken",result.refreshtoken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })
        res.status(200).json({
            success: true,
            message: result.message,
            accessToken: result.accesstoken,
        })
    } catch (error) {
        next(error)
    }
}
const refreshTokenController=async(req,res,next)=>{
    try {
        const refreshToken=req.cookies.refreshToken
        const result=await authService.refreshTokenService(refreshToken)
         res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            accessToken: result.accessstoken,
        });
    } catch (error) {
        next(error)
    }
}
const logoutController = async (req, res, next) => {
    try {

        await authService.logoutService();

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful.",
        });

    } catch (error) {
        next(error);
    }
};
const getProfileDetailsController = async (req, res, next) => {
    try {
        const result = await authService.getProfileDetailsService({
            userId: req.user.id,
        });

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
const editProfileDetailsController = async (req, res, next) => {
    try {
        const result = await authService.editProfileDetailsService({
            userId: req.user.id,...req.body
        });

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body;

        const result = await authService.forgotPasswordService(email);
        

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

const verifyOtpController = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await authService.verifyOtpService(
                req.body
            );

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};

const resetPasswordController = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await authService.resetPasswordService(
                req.body
            );

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};

const verifyEmailOtpController = async (req, res, next) => {
    try {
        const { email } = req.body;

        const result = await authService.verifyEmailOtp(email);
        

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

const verifyOtpemail = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await authService.verifyEmailService(
                req.body
            );

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};

const changePasswordController=async(req,res,next)=>{
    try {
        const id=req.user.id
        const response=await authService.changePassword({id,...req.body})
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

const uploadProfileImageController = async (req,res,next) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image.",
            });
        }

        const result = await authService.uploadPhotoService({
            userId: req.user.id,
            profileImage: req.file.path,
        });

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};

module.exports={
    registerController,
    logincontroller,
    refreshTokenController,
    logoutController,
    getProfileDetailsController,
    editProfileDetailsController,
    forgotPasswordController,
    verifyOtpController,
    resetPasswordController,
    verifyEmailOtpController,
    verifyOtpemail,
    changePasswordController,
    uploadProfileImageController
}