const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    url: {
        type: String,
        required: true
    },
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: Array
})

blogSchema.set('toJSON', {
    transform: (document, returned, options) => {
        returned.id = returned._id
        delete returned._id
        delete returned.__v
    }
})

blogSchema.set('toObject', {
    transform: (document, returned, options) => {
        returned.id = returned._id
        delete returned._id
        delete returned.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog