const express = require('express')
const path = require('path')
const { connect } = require('mongoose')

const { router: userRouter } = require('./routes/user.js')

connect('mongodb://127.0.0.1:27017/blogify')
  .then(() => console.log('Mongo DB Connected'))
  .catch((error) => console.log(error.message))

const app = express();
const PORT = 8000;

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(function (req, res, next) {
  console.log(`>> ${req.path}`)
  next()
})

app.use('/user', userRouter);

app.get('/', (req, res) => {
  return res.render('home');
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))   