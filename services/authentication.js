const JWT = require('jsonwebtoken')

const secret = process.env.SECRET_KEY

// Assign a token to user
function createToken(user) {
  // console.log("createToken",  user)
  const payload = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    profileImageURL: user.profileImageURL,
  };
  return JWT.sign(payload, secret);
}

// Validate user with token
function validateToken(token) {
  return JWT.verify(token, secret);
}


module.exports = {
  createToken,
  validateToken,
}