const multer = require('multer')
const fs = require('fs')

const storageForBlog = multer.diskStorage({
  destination: function (req, file, cb) {
      console.log(req, file)
      const directory = `./public/uploads/${req.user._id}`;
      if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true })
      }
      cb(null, directory)
  },
  filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
  }
})
const storageForProfile = multer.diskStorage({
  destination: function (req, file, cb) {
      const directory = `./public/profile`;
      if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true })
      }
      cb(null, directory)
  },
  filename: function (req, file, cb) {
    
      const fileName = `${req.body.email}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`
      cb(null, fileName)
  }
})

module.exports = {
  storageForBlog,
  storageForProfile,
}