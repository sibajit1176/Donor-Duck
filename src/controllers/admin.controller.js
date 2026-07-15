const adminService=require('../services/admin.service')

const getAllCharityController = async (req, res, next) => {
    try {
        const response = await adminService.getAllCharity();

        return res.status(200).json(response);

    } catch (error) {
        next(error);
    }
};

const getAllUserController = async (req, res, next) => {
    try {
        const response = await adminService.getAllUsers();

        return res.status(200).json(response);

    } catch (error) {
        next(error);
    }
};

const CharityApprovalController = async (req, res, next) => {
    try {
        const approvedBy = req.user.id;

        const response = await adminService.updateCharityStatus({
            ...req.body,
            approvedBy,
        });

        return res.status(200).json(response);

    } catch (error) {
        next(error);
    }
};

const blockUserController = async (req, res, next) => {
    try {
        
        const response = await adminService.blockUser(req.body);

        return res.status(200).json(response);

    } catch (error) {
        next(error);
    }
};

const adminDashBoardController=async(req,res,next)=>{
    try {
        const response=await adminService.adminDashBoardService()
        res.status(200).send(response)
    } catch (error) {
      next(error)        
    }
}

module.exports={
    blockUserController,
    CharityApprovalController,
    getAllCharityController,
    getAllUserController,
    adminDashBoardController
}