/**
 * Database Configuration and Model Initialization
 * Automatically switches between SQLite (Local) and Postgres (Render)
 */
const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

// CHECK: Is there a database URL provided? (Render provides this automatically)
if (process.env.DATABASE_URL) {
    // PRODUCTION MODE (Render)
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Necessary for Render's free tier
            }
        }
    });
} else {
    // DEVELOPMENT MODE (Local Laptop)
    // Keeps working exactly how it did before!
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', 'database.sqlite'),
        logging: false
    });
}

// Import models
const User = require('./User')(sequelize);
const Task = require('./Task')(sequelize);
const TaskAssignment = require('./TaskAssignment')(sequelize);
const Subtask = require('./Subtask')(sequelize);

// Define Relationships

// User self-reference: executor belongs to a manager
User.belongsTo(User, { as: 'manager', foreignKey: 'managerId' });
User.hasMany(User, { as: 'subordinates', foreignKey: 'managerId' });

// Task created by a User (manager)
Task.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
User.hasMany(Task, { as: 'createdTasks', foreignKey: 'createdById' });

// Many-to-many: Task <-> User through TaskAssignment
Task.belongsToMany(User, { through: TaskAssignment, as: 'assignees', foreignKey: 'taskId' });
User.belongsToMany(Task, { through: TaskAssignment, as: 'assignedTasks', foreignKey: 'userId' });

// TaskAssignment belongs to Task and User (for direct access)
TaskAssignment.belongsTo(Task, { foreignKey: 'taskId' });
TaskAssignment.belongsTo(User, { foreignKey: 'userId' });
Task.hasMany(TaskAssignment, { foreignKey: 'taskId' });
User.hasMany(TaskAssignment, { foreignKey: 'userId' });

// Subtask belongs to a Task
Subtask.belongsTo(Task, { foreignKey: 'taskId' });
Task.hasMany(Subtask, { as: 'subtasks', foreignKey: 'taskId' });

// Subtask can be assigned to a User
Subtask.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });
User.hasMany(Subtask, { as: 'assignedSubtasks', foreignKey: 'assignedToId' });

module.exports = {
    sequelize,
    User,
    Task,
    TaskAssignment,
    Subtask
};