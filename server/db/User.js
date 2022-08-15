const Sequelize = require('sequelize');
const db = require('./db');

const User = db.define('user', {
  // Add your Sequelize fields here
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  
  userType: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "STUDENT",
    validate: {
      len: [7, 7]
    }
  },
  //Virtual Field that determines if User is a STUDENT. Returns Boolean.
  isStudent: {
    type: Sequelize.VIRTUAL,
    get: function(){
      if (this.userType === "STUDENT"){
        return true
      }
      return false
    }
  },
   //Virtual Field that determines if User is a TEACHER. Returns Boolean.
  isTeacher: {
    type: Sequelize.VIRTUAL,
    get: function(){
      if(this.userType === "TEACHER"){
        return true
      }
      return false
    }
  }
  
  
});

User.findUnassignedStudents = async function () {
  //finds students with (userType: "STUDENT") & (mentorId: null) 
  const students = await this.findAll({
    where: {
      userType: "STUDENT",
      mentorId: null
    }
  })

  return students
}

User.findTeachersAndMentees = async function () {
  const teachers = await this.findAll({
    where: {
      userType: "TEACHER"
    },
    include: {
      model: User, 
      as: "mentees"
    }
  })

 
  console.log(teachers)

  return teachers
}


/**
 * We've created the association for you!
 *
 * A user can be related to another user as a mentor:
 *       SALLY (mentor)
 *         |
 *       /   \
 *     MOE   WANDA
 * (mentee)  (mentee)
 *
 * You can find the mentor of a user by the mentorId field
 * In Sequelize, you can also use the magic method getMentor()
 * You can find a user's mentees with the magic method getMentees()
 */

User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentees', foreignKey: 'mentorId' });

module.exports = User;
