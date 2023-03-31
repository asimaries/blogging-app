const { Blog } = require('../models/blog')

const handleNewBlog = async (req, res) => {
  const { title, body } = req.body;
  const filename = req.file?.filename;

  console.log(title, body, filename);

  const blog = await Blog.create({
    title,
    body,
    coverImageURL: filename,
    createdBy: req.user._id,
    createdByName: req.user.fullName,
  })
  return res.redirect(`/blog/${blog._id}`);
}

module.exports = {
  handleNewBlog,
}