const { Router } = require('express')
const multer = require('multer')
// const { storageForBlog } = require('../services/uploadfile')
const { Blog } = require('../models/blog')

const router = Router()
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
const upload = multer({ storage: storageForBlog })

router.get('/new-blog', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    })
})
router.post('/new-blog', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const { filename } = req.file;

    console.log(title, body, filename);

    const blog = await Blog.create({
        title,
        body,
        coverImageURL: filename,
        createdBy: req.user._id,
        createdByName: req.user.fullName,
    })
    return res.redirect('/');
})

router.get('/:blogID', (req, res) => {

    return res.render('')
})

module.exports = {
    router,
}