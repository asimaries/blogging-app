const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const { connect } = require('mongoose')

const { router: authRouter } = require('./routes/user.js')
const { router: blogRouter } = require('./routes/blog.js')
const { checkForAuthenticationCookie } = require('./middlewares/authentication.js')
const { Blog } = require('./models/blog.js')

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
app.use('/static', express.static(path.resolve('./public')))
app.use(checkForAuthenticationCookie('token'))

app.use(function (req, res, next) {
  console.log(`>> ${req.method}-${req.path}`)
  next()
})

app.use('/auth', authRouter);
app.use('/blog', blogRouter);

app.get('/', async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 })
  return res.render('home', {
    user: req.user,
    blogs: blogs,
  });
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))   