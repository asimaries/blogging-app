const { User } = require('../models/user')

const handleSignUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.body)
  const user = await User.create({
    fullName, email, password
  })
  return res.redirect('/user/signin')
}

const handleSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.matchPassword(email, password);
  console.log(user)
  return res.redirect('/')
};

module.exports = {
  handleSignUp,
  handleSignIn,
}