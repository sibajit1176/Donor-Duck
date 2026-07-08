const { DataTypes } = require("sequelize");
const sequelize = require('../config/database')

const Charity = sequelize.define(
    "Charity",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },

        organizationName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        registrationNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        registrationDocument: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        mission: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        vision: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        category: {
            type: DataTypes.ENUM(
                "Education",
                "Healthcare",
                "Food",
                "Environment",
                "Animal Welfare",
                "Women Empowerment",
                "Disaster Relief",
                "Children",
                "Other"
            ),
            allowNull: false,
        },

        website: {
            type: DataTypes.STRING,
                        allowNull: true,
        },

        email: {
            type: DataTypes.STRING,
                        allowNull: true,
        },

        phone: {
            type: DataTypes.STRING,
                        allowNull: true,
        },

        address: {
            type: DataTypes.STRING,
                        allowNull: true,
        },

        city: {
            type: DataTypes.STRING,
                        allowNull: true,
        },

        state: {
            type: DataTypes.STRING,
                        allowNull: true,
        },

        country: {
            type: DataTypes.STRING,
                        allowNull: true,
        },

        logo: {
            type: DataTypes.STRING,
                        allowNull: true,
        },

        coverImage: {
            type: DataTypes.STRING,
                        allowNull: true,
        },

        goalAmount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },

        currentAmount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
        },

        approvalStatus: {
            type: DataTypes.ENUM(
                "PENDING",
                "APPROVED",
                "REJECTED"
            ),
            defaultValue: "PENDING",
        },

        approvedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },

        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        rejectionReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        paranoid: true,
        timestamps: true,
    }
);

module.exports = Charity;