const route=require('express').Router()
const authcontroller=require('../controllers/auth.controller')

route.post('/register',authcontroller.registerController)
route.post('/login',authcontroller.logincontroller)
route.post('/refresh-token',authcontroller.refreshTokenController)


module.exports=route