const route=require('express').Router()
const authcontroller=require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')


route.post('/register',authcontroller.registerController)
route.post('/login',authcontroller.logincontroller)
route.post('/refresh-token',authcontroller.refreshTokenController)
route.post("/logout",authMiddleware,authcontroller.logoutController);
route.post("/getProfileDetails",authMiddleware,authcontroller.getProfileDetailsController);
route.post("/editProfileDetails",authMiddleware,authcontroller.editProfileDetailsController);



module.exports=route