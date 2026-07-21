const charityService = require('../services/charity.service')

const registercharityControler = async (req, res, next) => {
    try {
        const charity = await charityService.registercharityService({
            userId: req.user.id,
            ...req.body
        })
        res.status(201).send(charity)
    } catch (error) {
        next(error)
    }
}

const getcharityprofileController = async (req, res, next) => {
    try {

        const charity = await charityService.getCharityProfileService(req.user.id)
        res.status(200).send(charity)
    } catch (error) {
        next(error)
    }
}

const editcharityprofileController = async (req, res, next) => {
    try {

        const charity = await charityService.editCharityProfileService({
            userId: req.user.id,
            ...req.body
        })
        res.status(200).send(charity)
    } catch (error) {
        next(error)
    }
}

const deletecharityprofileController = async (req, res, next) => {
    try {
        const charity = await charityService.deleteCharityProfileService(req.user.id)
        res.status(200).send(charity)
    } catch (error) {
        next(error)
    }
}

const getAllCharityController = async (req, res, next) => {
    try {
        const response = await charityService.getAllCharityService()
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }

}

const getCharityProfilfullDetailseController = async (req, res, next) => {
    try {

        const charity = await charityService.getCharityProfilfullDetailseService(req.user.id)
        res.status(200).send(charity)
    } catch (error) {
        next(error)
    }
}

const getcharityprofileforAllUserController = async (req, res, next) => {
    try {
           const {id}=req.params
        const charity = await charityService.getCharityProfileServiceForAllUser(id)
        res.status(200).send(charity)
    } catch (error) {
        next(error)
    }
}

const uploadCharityLogoController = async (req,res,next) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image.",
            });
        }

        const result = await charityService.uploadCharitylogoService({
            userId: req.user.id,
            logo: req.file.path,
        });

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};

const uploadCharityCoverImageController = async (req,res,next) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image.",
            });
        }

        const result = await charityService.uploadCharityCoverImageService({
            userId: req.user.id,
            coverImage: req.file.path,
        });

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};


module.exports = {
    registercharityControler,
    getcharityprofileController,
    editcharityprofileController,
    deletecharityprofileController,
    getAllCharityController,
    getCharityProfilfullDetailseController,
    getcharityprofileforAllUserController,
    uploadCharityCoverImageController,
    uploadCharityLogoController
}