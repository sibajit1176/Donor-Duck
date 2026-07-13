const route=require('express').Router()
const donationController=require('../controllers/donation.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const charitymiddleware = require('../middlewares/charity.middleware')

route.post('/createPayment',authMiddleware,donationController.createPaymentcontroller)
route.get('/verifyPayment/:order_id',authMiddleware,donationController.verifyPaymentcontroller)
route.get('/getUserPaymentHitory',authMiddleware,donationController.getUserPaymentController)
route.get('/getCharityPaymentHitory',authMiddleware,charitymiddleware,donationController.getCharityPaymentController)


module.exports=route