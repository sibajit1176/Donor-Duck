const donationService=require('../services/donation.service')

const createPaymentcontroller=async(req,res,next)=>{
    try {
        const userId=req.user.id
        const result=await donationService.createDonationService({userId,...req.body})
        res.status(201).send(result)
    } catch (error) {
        next(error)
    }
}

const verifyPaymentcontroller=async(req,res,next)=>{
    try {
        const userId=req.user.id
        const result=await donationService.verifyPaymentService(req.body)
        res.status(201).send(result)
    } catch (error) {
        next(error)
    }
}

const getUserPaymentController=async(req,res,next)=>{
    try {
        const result=await donationService.getUserPaymentService(req.user.id)
        res.status(200).send(result)
    } catch (error) {
        next(error)
    }
}

const getCharityPaymentController=async(req,res,next)=>{
    try {
        const result=await donationService.getCharityPaymentService(req.user.id)
        res.status(200).send(result)
    } catch (error) {
        next(error)
    }
}


module.exports={
    createPaymentcontroller,
    verifyPaymentcontroller,
    getUserPaymentController,
    getCharityPaymentController
}