const { Schema, model } = require('mongoose')
const { createHmac, randomBytes } = require('crypto')


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
  profileImgURL: {
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
  const user = this;
  if (!user.isModified('password')) next();
  const salt = randomBytes(16).toString();
  const hashPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex')

  this.salt = salt
  this.password = hashPassword
  next()
})

userSchema.static('matchPassword', async function (email, password) {
  const user = await this.findOne({ email })
  if (!user) throw new Error('User not Found');

  const hashPassword = createHmac('sha256', user.salt)
    .update(password)
    .digest('hex')
  if (hashPassword !== user.password) throw new Error('Wrong Password');
  return { ...user._doc, password: undefined, salt: undefined }
})

const User = model('user', userSchema)

module.exports = {
  User,
}