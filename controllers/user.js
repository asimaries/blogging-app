const { User } = require('../models/user');
const { validateToken } = require('../services/authentication');

async function handleSignUp(req, res) {
  const { fullName, email, password } = req.body;
  // console.log(req.body)
  try {
    await User.create({
      fullName, email, password
    })
    return res.redirect('/auth/signin')
  } catch (error) {
    console.log(error.message)
    if (error.code == 11000) {
      return res.render('signup', {
        error: 'User already exits'
      })
    }
  }
}

async function handleSignIn(req, res) {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.locals.user = validateToken(token);
    console.log(res.locals.user, "logged in")
    return res.cookie('token', token).redirect('/');

  } catch (error) {
    return res.render('signin', {
      error: 'Incorrect Email or Password'
    })
  }

  console.log(token)
};

module.exports = {
  handleSignUp,
  handleSignIn,
}