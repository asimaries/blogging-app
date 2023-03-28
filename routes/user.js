const { Router } = require('express')
const multer = require('multer')
const { handleSignUp, handleSignIn } = require('../controllers/user')
const { storageForProfile } = require('../services/uploadfile')
const router = Router()

const upload = multer({ storage: storageForProfile })

router.get('/signin', (req, res) => {
  return res.render('signin')
})
router.get('/signup', (req, res) => {
  return res.render('signup')
})

router.get('/logout', (req, res) => {
  return res.clearCookie('token').redirect('/')
})


router.post('/signup', upload.single('profileImageURL'), handleSignUp)
router.post('/signin', handleSignIn)


module.exports = { router };