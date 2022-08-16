const Sequelize = require('sequelize')
const db = require('./db');
const User = require('./User');
const Subject = require('./Subject');
const seed = require('./seed');

// If we were to create any associations between different tables
// this would be a good place to do that:
const StudentSubjects = db.define('StudentSubjects', {
  StudentId: {
    type: Sequelize.INTEGER,
    references: {
      model: Subject,
      key: "id"
    }
  },
  UserId: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: "id"
    }
  }
})


Subject.belongsToMany(User, { through: StudentSubjects })
User.belongsToMany(Subject, { through: StudentSubjects })


module.exports = {
  db,
  seed,
  models: {
    User,
    Subject,
  },
};
