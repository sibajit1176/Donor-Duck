const route=require('express').Router()
const charityProjectController=require('../controllers/charityProject.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const charitymiddleware = require('../middlewares/charity.middleware')

route.post('/createProject',authMiddleware,charitymiddleware,charityProjectController.createProjectController)
route.post('/editProjectProfile',authMiddleware,charitymiddleware,charityProjectController.editProjectController)
route.post('/getProjectById/:projectId',authMiddleware,charitymiddleware,charityProjectController.getProjectByIdController)
route.post('/deleteProjectById/:projectId',authMiddleware,charitymiddleware,charityProjectController.deleteProjectByIdController)
route.get('/getAllProjectforthisuser',authMiddleware,charitymiddleware,charityProjectController.getAllProjectController)
route.get('/getAllProjectforAllUser',charityProjectController.getDataForProjectpage)


module.exports=route