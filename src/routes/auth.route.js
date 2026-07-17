const route=require('express').Router()
const authcontroller=require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')


route.post('/register',authcontroller.registerController)
route.post('/login',authcontroller.logincontroller)
route.post('/refresh-token',authcontroller.refreshTokenController)
route.post("/logout",authMiddleware,authcontroller.logoutController);
route.post("/getProfileDetails",authMiddleware,authcontroller.getProfileDetailsController);
route.post("/editProfileDetails",authMiddleware,authcontroller.editProfileDetailsController);
route.post('/forgotPassword',authcontroller.forgotPasswordController)
route.post('/verifyOtp',authcontroller.verifyOtpController)
route.post('/restPasword',authcontroller.resetPasswordController)
route.post('/sendOtp',authMiddleware,authcontroller.verifyEmailOtpController)
route.post('/verifyOtpemail',authMiddleware,authcontroller.verifyOtpemail)
route.post('/updatePassword',authMiddleware,authcontroller.changePasswordController)



module.exports=route