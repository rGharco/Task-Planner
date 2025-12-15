/**
 * TaskAssignment Model
 * Junction table for many-to-many relationship between Tasks and Users
 * Allows assigning multiple users to a single task with optional roles
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TaskAssignment = sequelize.define('TaskAssignment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'task_assignments',
        timestamps: true
    });

    return TaskAssignment;
};