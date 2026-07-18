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

const donationManagementController=async(req,res,next)=>{
    try {
        const response=await adminService.showAllDonation()
        res.status(200).send(response)
    } catch (error) {
      next(error)        
    }
}

const adminotpController = async (req, res, next) => {
    try {
        const { email } = req.body;

        const result = await adminService.adminPermisssonOtpSent(email);
        

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

const adminverifyOtpController = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await adminService.AdminverifyOtpService(
                req.body
            );

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};


module.exports={
    blockUserController,
    CharityApprovalController,
    getAllCharityController,
    getAllUserController,
    adminDashBoardController,
    donationManagementController,
    adminotpController,
    adminverifyOtpController
}