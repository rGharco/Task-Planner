/**
 * Subtask Model
 * Represents subtasks that belong to a parent task
 * Each subtask can have its own deadline and assignee
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Subtask = sequelize.define('Subtask', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('OPEN', 'PENDING', 'COMPLETED', 'CLOSED'),
            allowNull: false,
            defaultValue: 'OPEN'
        }
    }, {
        tableName: 'subtasks',
        timestamps: true
    });

    return Subtask;
};