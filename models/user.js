const { Schema, model } = require('mongoose')
const { createHmac, randomBytes } = require('crypto');
const { createToken } = require('../services/authentication');


const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profileImageURL: {
    type: String,
    default: '/images/avatar.svg'
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  }
}, { timestamps: true })

userSchema.pre('save', function (next) {
  // const user = this;
  if (!this.isModified('password')) next();

  const salt = randomBytes(16).toString();
  const hashPassword = createHmac('sha256', salt)
    .update(this.password)
    .digest('hex')

  this.salt = salt
  this.password = hashPassword

  next()
})

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
  const user = await this.findOne({ email })
  if (!user)
    throw new Error('User not Found');

  const hashPassword = createHmac('sha256', user.salt)
    .update(password)
    .digest('hex')

  if (hashPassword !== user.password)
    throw new Error('Wrong Password');
  // return { ...user._doc, password: undefined, salt: undefined }
  return createToken(user);
})

const User = model('user', userSchema)

module.exports = {
  User,
}