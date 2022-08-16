const router = require('express').Router();
const Sequelize = require('sequelize')
const {
  models: { User },
} = require('../db');
const Op = Sequelize.Op

/**
 * All of the routes in this are mounted on /api/users
 * For instance:
 *
 * router.get('/hello', () => {...})
 *
 * would be accessible on the browser at http://localhost:3000/api/users/hello
 *
 * These route tests depend on the User Sequelize Model tests. However, it is
 * possible to pass the bulk of these tests after having properly configured
 * the User model's name and userType fields.
 */

// Add your routes here:

router.post('/', async (req, res, next) => {
  try {
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.name
      }
    })
    if (wasCreated === false){
      return res.status(409).send( 'Incorrect status code')
    }
    res.status(201).send(user)
  }
  catch (ex) {
    next (ex)
  }
})

router.get('/', async (req, res, next) => {
  try{
    let name = req.query.name
  
    const users = await User.findAll({
      where: {
        name: {
          [Op.iLike]: "%ed%"
        }
      }
    })

    res.status(200).send(users)
  }
  catch (ex) {
    next(ex)
  }
})


router.get('/unassigned', async (req, res, next) => {
  try {
    const students = await User.findUnassignedStudents()

    res.send( students )
  }
  catch (ex) {
    next(ex)
  }
})

router.get('/teachers', async (req, res, next) => {
  try{
    const teachers = await User.findTeachersAndMentees()

    res.send( teachers )
  }
  catch (ex) {
    next(ex)
  }
})

router.delete('/:id', async (req, res, next) => {

  
  try {
    let userId = req.params.id
    
    //transforms any string into a number or NaN
    userId = parseInt(userId)

    //sends 400 error if usderId is
    if(isNaN(userId)){
      res.sendStatus(400)
    }
    //queries for user based on userId
    let user = await User.findByPk(userId)
    
    //sends 404, if previous query is null
    if(user === null) {
     return res.sendStatus(404)
    }
    
    

    //deletes user if the userId is valid
    else {
      await User.destroy({
        where: {
          id: req.params.id
        }
      })
      res.sendStatus(204)
    }
  }
  
  catch (ex) {
    // if (typeof req.params.id !== "number" ){
    //   res.sendStatus(400)
    // }
    next(ex)
  }
})

router.put('/:id', async (req, res, next) => {
  

  try {

    const user = await User.findAll({
      where: {
        id: req.params.id
      }
    })
  

    if(user.length < 1) {
      res.sendStatus(404)
    }

    let newUser = user[0].dataValues

    newUser.name = req.body.name       
    newUser.userType = req.body.userType

    res.status(200).send(newUser)
  }
  catch (ex) {
    // res.sendStatus(404)
    next (ex)
  }
})




module.exports = router;
