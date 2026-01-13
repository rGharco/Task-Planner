/**
 * Task Model
 * Represents tasks created by managers
 * Status flow: OPEN -> PENDING -> COMPLETED -> CLOSED
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('OPEN', 'PENDING', 'COMPLETED', 'CLOSED'),
            allowNull: false,
            defaultValue: 'OPEN'
        },
        executor: {
            type: DataTypes.STRING,
            allowNull: true
        },
        asigneeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'tasks',
        timestamps: true
    });

    return Task;
};