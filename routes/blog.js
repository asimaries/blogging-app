const { Router } = require('express')
const multer = require('multer')

const { storageForBlog } = require('../services/uploadfile')
const { Blog } = require('../models/blog')
const { Comment } = require('../models/comment')
const { handleNewBlog } = require('../controllers/blog')

const router = Router()

const upload = multer({ storage: storageForBlog })

router.get('/new-blog', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    })
})

router.post('/new-blog', upload.single('coverImage'), handleNewBlog)

router.get('/:blogID', async (req, res) => {
    const blog = await Blog.findOne({ _id: req.params.blogID }).populate("createdBy")
    const comments = await Comment.find({ blogId: req.params.blogID }).populate('createdBy')
    return res.render('blogpage', {
        user: req.user,
        blog: blog,
        comments: comments,
    })
})

router.post('/comment/:blogId', async (req, res) => {

    await Comment.create({
        content: req.body.comment,
        createdBy: req.user._id,
        blogId: req.params.blogId,
    });
    return res.redirect(`/blog/${req.params.blogId}`)

})

module.exports = {
    router,
}