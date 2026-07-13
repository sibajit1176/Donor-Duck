const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Donation = sequelize.define(
    "Donation",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        orderId:{
            type:DataTypes.STRING,
            allowNull:false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },

        charityId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Charities",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },

        projectId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "CharityProjects",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },

        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 1,
            },
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        isAnonymous: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        status: {
            type: DataTypes.ENUM(
                "PENDING",
                "SUCCESS",
                "FAILED",
                "CANCELLED",
                "REFUNDED"
            ),
            allowNull: false,
            defaultValue: "PENDING",
        },
    },
    {
        timestamps: true,
        paranoid: true,
    }
);

module.exports = Donation;