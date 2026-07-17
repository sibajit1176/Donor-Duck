const route=require('express').Router()
const charityController=require('../controllers/charity.controllers')
const authMiddleware = require('../middlewares/auth.middleware')

route.post('/registerCharity',authMiddleware,charityController.registercharityControler)
route.get('/getcharityProfile',authMiddleware,charityController.getcharityprofileController)
route.post('/editcharityProfile',authMiddleware,charityController.editcharityprofileController)
route.get('/deletecharityProfile',authMiddleware,charityController.deletecharityprofileController)
route.get('/getAllCharity',charityController.getAllCharityController)
route.get('/getcharityProfileAllDetails',authMiddleware,charityController.getCharityProfilfullDetailseController)
route.get("/getCharityProfileDetailsforAllUser/:id",charityController.getcharityprofileforAllUserController);


module.exports=route