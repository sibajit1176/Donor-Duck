const charityProjectService = require("../services/charityProject.service");

const createProjectController = async (req, res, next) => {
    try {
        const result = await charityProjectService.createcharityProjectService({
            userId: req.user.id,
            ...req.body,
        });

        return res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const editProjectController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const result = await charityProjectService.editCharityProjectService({ userId, ...req.body });
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
const getProjectByIdController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { projectId } = req.params;
        const result = await charityProjectService.getCharityProjectbyIdService({ userId, projectId });
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const deleteProjectByIdController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { projectId } = req.params;
        const result = await charityProjectService.deleteCharityProjectbyIdService({ userId, projectId });
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getAllProjectController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const result = await charityProjectService.getAllCharityProjectService({ userId });
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getDataForProjectpage = async (req, res, next) => {
    try {
        const result = await charityProjectService.getAllProjectsService()
        return res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

const uploadProjectCoverImageController = async (req, res, next) => {

    try {
           
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image.",
            });
        }
        const { projectId } = req.params;
        const result = await charityProjectService.uploadProjectCoverImageService({
            userId: req.user.id,
            coverImage: req.file.path,
            projectId
        });

        return res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};

module.exports = {
    createProjectController,
    editProjectController,
    getAllProjectController,
    getProjectByIdController,
    deleteProjectByIdController,
    getDataForProjectpage,
    uploadProjectCoverImageController
};