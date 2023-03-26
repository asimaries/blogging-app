const { Router } = require('express')
const { handleSignUp, handleSignIn } = require('../controllers/user')

const router = Router()

router.get('/signin', (req, res) => {
  return res.render('signin')
})
router.get('/signup', (req, res) => {
  return res.render('signup')
})

router.post('/signup', handleSignUp)
router.post('/signin', handleSignIn)

module.exports = { router };