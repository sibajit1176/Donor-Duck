const route=require('express').Router()
const charityController=require('../controllers/charity.controllers')
const authMiddleware = require('../middlewares/auth.middleware')
const { uploadProfileImage, uploadCharityCover } = require('../middlewares/upload.middleware')

route.post('/registerCharity',authMiddleware,charityController.registercharityControler)
route.get('/getcharityProfile',authMiddleware,charityController.getcharityprofileController)
route.post('/editcharityProfile',authMiddleware,charityController.editcharityprofileController)
route.get('/deletecharityProfile',authMiddleware,charityController.deletecharityprofileController)
route.get('/getAllCharity',charityController.getAllCharityController)
route.get('/getcharityProfileAllDetails',authMiddleware,charityController.getCharityProfilfullDetailseController)
route.get("/getCharityProfileDetailsforAllUser/:id",charityController.getcharityprofileforAllUserController);
route.put("/charityLogo-image",authMiddleware,uploadProfileImage.single("logo"),charityController.uploadCharityLogoController);
route.put("/charityCover-image",authMiddleware,uploadCharityCover.single("coverImage"),charityController.uploadCharityCoverImageController);


module.exports=route