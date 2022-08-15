const router = require('express').Router();
const {
  models: { User },
} = require('../db');

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
    const userId = req.params.id 

    //queries for all users with "userId"
    const user = await User.findAll({
      where: {
        id: userId
      }
    })

    //sends 404, if userId returns an empty array
    if(user.length === 0) {
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
    //sends status of 400 if userId is not a number
    res.sendStatus(400)
  }
})




module.exports = router;
