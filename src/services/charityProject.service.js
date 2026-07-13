const Charity = require("../models/charity")
const CharityProject = require("../models/charityProject");
const Donation = require("../models/donationhitoryTable");
const User = require("../models/user");
const {Op}=require('sequelize')


const createcharityProjectService = async (payload) => {
    const {
        userId,
        title,
        description,
        category,
        goalAmount,
        startDate,
        endDate,
        coverImage,
    } = payload;

    const charity = await Charity.findOne({
        where: { userId },
    });

    if (!charity) {
        const err = new Error("Charity not found.");
        err.statusCode = 404;
        throw err;
    }

    if (charity.approvalStatus !== "APPROVED") {
        const err = new Error(
            "Your charity is not approved yet. You cannot create projects."
        );
        err.statusCode = 403;
        throw err;
    }

    const project = await CharityProject.create({
        charityId: charity.id,
        title,
        description,
        category,
        goalAmount,
        startDate,
        endDate,
        coverImage,
    });

    return {
        message: "Project created successfully.",
        data: project,
    };
};

const editCharityProjectService = async (payload) => {
    const {
        projectId,
        userId,
        title,
        description,
        category,
        goalAmount,
        startDate,
        endDate,
        status,
    } = payload;

    const charity = await Charity.findOne({
        where: { userId },
    });

    if (!charity) {
        const err = new Error("Charity not found.");
        err.statusCode = 404;
        throw err;
    }

    const project = await CharityProject.findOne({
        where: {
            id: projectId,
            charityId: charity.id,
        },
    });

    if (!project) {
        const err = new Error("Project not found.");
        err.statusCode = 404;
        throw err;
    }

   const result= await project.update({
        title,
        description,
        category,
        goalAmount,
        startDate,
        endDate,
        status,
    });

    return {
        message: "Project updated successfully.",
        result,
        payload
    };
};

const getCharityProjectbyIdService = async ({ userId, projectId }) => {

    const charity = await Charity.findOne({
        where: { userId },
        attributes: [
            "id",
            "organizationName",
            "registrationNumber",
            "email",
            "phone",
            "website",
        ],
    });

    if (!charity) {
        const err = new Error("Charity not found.");
        err.statusCode = 404;
        throw err;
    }

    const project = await CharityProject.findOne({
        where: {
            id: projectId,
            charityId: charity.id,
        },
        attributes: [
            "id",
            "title",
            "description",
            "category",
            "goalAmount",
            "raisedAmount",
            "totalDonors",
            "startDate",
            "endDate",
            "status",
            "isFeatured",
            "coverImage",
            "createdAt",
            "updatedAt",
        ],
    });

    if (!project) {
        const err = new Error("Project not found.");
        err.statusCode = 404;
        throw err;
    }

    const donationHistory = await Donation.findAll({
        where: {
            projectId,
            status: "SUCCESS",
        },
        attributes: [
            "id",
            "amount",
            "message",
            "isAnonymous",
            "createdAt",
        ],
        include: [
            {
                model: User,
                as:"user",
                attributes: ["name"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    return {
        message: "Project fetched successfully.",
        project,
        charity,
        donationHistory,
    };

};

const getAllCharityProjectService = async (payload) => {
    const {userId}=payload
     const charity = await Charity.findOne({
        where: { userId },
    });

    if (!charity) {
        const err = new Error("Charity not found.");
        err.statusCode = 404;
        throw err;
    }
    const project = await CharityProject.findAll({
        where:{
            charityId:charity.id
        }
    });

   if (project.length === 0) {
    return {
        message: "No projects found.",
        data: []
    };
}
    return {
        message: "Project get successfully.",
        data: project,
    };
};

const deleteCharityProjectbyIdService = async (payload) => {
     const {userId,projectId}=payload
     const charity = await Charity.findOne({
        where: { userId },
    });

    if (!charity) {
        const err = new Error("Charity not found.");
        err.statusCode = 404;
        throw err;
    }
    
    const project = await CharityProject.findOne({
        where: {
            id: projectId,
            charityId: charity.id,
        },
    });

    if (!project) {
        const err = new Error("Project not found.");
        err.statusCode = 404;
        throw err;
    }
    await project.destroy()
    return {
        message: "Project deleted successfully.",
    };
};

const getAllProjectsService = async () => {
    const projects = await CharityProject.findAll({
        where: {
            status: {
                [Op.ne]: "CANCELLED",
            },
        },
        attributes: [
            "id",
            "title",
            "description",
            "category",
            "coverImage",
            "totalDonors",
            "goalAmount",
        ],
        include: [
            {
                model: Charity,
                as:"charity",
                attributes: [
                    "id",
                    "organizationName",
                    "logo",
                ],
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    return {
        message: "Projects fetched successfully.",
        projects,
    };
};

module.exports={
    createcharityProjectService,
    editCharityProjectService,
    getAllCharityProjectService,
    getCharityProjectbyIdService,
    deleteCharityProjectbyIdService,
    getAllProjectsService
}