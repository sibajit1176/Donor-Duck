const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    role: {
        type: DataTypes.ENUM("USER", "CHARITY", "ADMIN"),
        defaultValue: "USER"
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM("ACTIVE", "BLOCKED"),
        defaultValue: "ACTIVE"
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
    linkedInProfile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    twiterProfile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true,
    },

},
    {
        timestamps: true,
        paranoid: true,
        tableName: "users"
    }
)

module.exports = User