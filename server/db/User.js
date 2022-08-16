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

  return teachers
}

User.prototype.getPeers = async function(){
  const students = await User.findAll({
    where: {
      mentorId: this.mentorId
    }
  })
  for (let i = 0; i < students.length; i++){
    let studentId = students[i].dataValues.id
    if (studentId === this.id){
      students.splice(i, 1)
    }
  }

  return students
}

User.beforeUpdate( async (user) => {
  let mentorId = user.mentorId
  
  //Gathering all students matching the mentorId
  let students = await User.findAll({
    where: {
      id: mentorId,
      userType: "STUDENT"
    }
  })
  //Loops through students array to see if targeted mentor is a Student
  for (let i = 0; i < students.length; i++){
    let studentId = students[i].dataValues.id
    if(mentorId === studentId){
      throw new Error
    }
  }

})

User.beforeUpdate(user => {
  if ((user.userType === "TEACHER") && (user.mentorId !== null) ){
    throw new Error
  }
})

User.beforeUpdate( async (user) => {
  let teacherId = user.id
  
  //finds student with a matching mentorId to teacherId
  let student = await User.findAll({
    where: {
      mentorId: teacherId
    }
  })
  
  //Loops through student array to see if mentorId matches teacherId, if so then it will throw an error
  for (let i = 0; i < student.length; i++){
    let mentorId = student[i].dataValues.mentorId
    if( mentorId === teacherId){
      throw new Error
    }
  }
})




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
