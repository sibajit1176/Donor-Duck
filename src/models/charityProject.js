const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CharityProject = sequelize.define(
    "CharityProject",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        charityId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Charities",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },

        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        category: {
            type: DataTypes.ENUM(
                "Education",
                "Healthcare",
                "Food",
                "Environment",
                "Disaster Relief",
                "Women Empowerment",
                "Children",
                "Animal Welfare",
                "Other"
            ),
            allowNull: false,
        },

        goalAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },

        raisedAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        },

        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        coverImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM(
                "DRAFT",
                "ACTIVE",
                "COMPLETED",
                "CANCELLED"
            ),
            allowNull: false,
            defaultValue: "DRAFT",
        },

        totalDonors: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        isFeatured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        timestamps: true,
        paranoid: true,
    }
);

module.exports = CharityProject;