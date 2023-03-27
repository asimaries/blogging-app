const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const { connect } = require('mongoose')

const { router: authRouter } = require('./routes/user.js')
const { checkForAuthenticationCookie } = require('./middlewares/authentication.js')

connect('mongodb://127.0.0.1:27017/blogify')
  .then(() => console.log('Mongo DB Connected'))
  .catch((error) => console.log(error.message))

const app = express();
const PORT = 8000;

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

app.use(checkForAuthenticationCookie('token'))

app.use(function (req, res, next) {
  console.log(`>> ${req.method}-${req.path}`)
  next()
})

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  return res.render('home', {
    user: req.user,
  });
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))   