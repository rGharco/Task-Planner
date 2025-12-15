/**
 * User Model
 * Represents users in the system (admin, manager, executor)
 * A user can belong to a manager (self-referential relationship)
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('admin', 'manager', 'executor'),
            allowNull: false,
            defaultValue: 'executor'
        }
    }, {
        tableName: 'users',
        timestamps: true
    });

    return User;
};