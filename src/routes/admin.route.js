const route=require('express').Router()
const admincontroller=require('../controllers/admin.controller')
const adminmiddleware = require('../middlewares/admin.middleware')
const authMiddleware = require('../middlewares/auth.middleware')


route.get('/getAllcharities',authMiddleware,adminmiddleware,admincontroller.getAllCharityController)
route.get('/getAllUsers',authMiddleware,adminmiddleware,admincontroller.getAllUserController)
route.post('/ApproveCharity',authMiddleware,adminmiddleware,admincontroller.CharityApprovalController)
route.post('/BlockUser',authMiddleware,adminmiddleware,admincontroller.blockUserController)
route.get('/adminDashBoard',authMiddleware,adminmiddleware,admincontroller.adminDashBoardController)


module.exports=route