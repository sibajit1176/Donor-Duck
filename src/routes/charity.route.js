const route=require('express').Router()
const charityController=require('../controllers/charity.controllers')
const authMiddleware = require('../middlewares/auth.middleware')

route.post('/registerCharity',authMiddleware,charityController.registercharityControler)
route.get('/getcharityProfile',authMiddleware,charityController.getcharityprofileController)
route.get('/editcharityProfile',authMiddleware,charityController.editcharityprofileController)
route.get('/deletecharityProfile',authMiddleware,charityController.deletecharityprofileController)

module.exports=route