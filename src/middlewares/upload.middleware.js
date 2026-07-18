const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/* -----------------------------
   Profile Image (400 x 400)
--------------------------------*/

const profileStorage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: "charity-platform/users",
        public_id: `user_${Date.now()}`,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
            {
                width: 400,
                height: 400,
                crop: "fill",
                gravity: "face",
            },
            {
                quality: "auto",
            },
            {
                fetch_format: "auto",
            },
        ],
    }),
});


const charityCoverStorage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: "charity-platform/charity-cover",
        public_id: `charity_cover_${Date.now()}`,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
            {
                width: 1400,
                height: 500,
                crop: "fill",
            },
            {
                quality: "auto",
            },
            {
                fetch_format: "auto",
            },
        ],
    }),
});


const projectCoverStorage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: "charity-platform/project-cover",
        public_id: `project_cover_${Date.now()}`,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
            {
                width: 1400,
                height: 700,
                crop: "fill",
            },
            {
                quality: "auto",
            },
            {
                fetch_format: "auto",
            },
        ],
    }),
});



const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."), false);
    }

};

const uploadProfileImage = multer({
    storage: profileStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const uploadCharityCover = multer({
    storage: charityCoverStorage,
    fileFilter,
    limits: {
        fileSize: 8 * 1024 * 1024,
    },
});

const uploadProjectCover = multer({
    storage: projectCoverStorage,
    fileFilter,
    limits: {
        fileSize: 8 * 1024 * 1024,
    },
});


module.exports = {
    uploadProfileImage,
    uploadCharityCover,
    uploadProjectCover,
};