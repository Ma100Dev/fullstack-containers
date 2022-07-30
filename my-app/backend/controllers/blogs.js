const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose')
require('express-async-errors')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
    let blog = request.body
    if (blog.likes === undefined) {
        blog.likes = 0
    }
    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    blog.user = user
    const obj = await new Blog(blog).save()
    user.blogs = user.blogs.concat(obj.id)
    await user.save()
    response.status(201).json(obj)
})

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user
    if (user === null || user === undefined) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (user.id.toString() !== blog.user.toString()) {
        return response.status(403).json({ error: 'user can only delete their own blogs!' })
    }
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const oldBlog = await Blog.findById(request.params.id)
    if (!oldBlog) {
        response.status(404).end()
        return
    }
    oldBlog.title = request.body.title || oldBlog.title
    oldBlog.author = request.body.author || oldBlog.author
    oldBlog.url = request.body.url || oldBlog.url
    oldBlog.likes = request.body.likes ?? oldBlog.likes
    await oldBlog.save()
    response.send(oldBlog)
})

blogsRouter.get('/:id/comments', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    response.send(blog.comments)
})

blogsRouter.post('/:id/comments', async (request, response) => {
    const user = request.user
    if (user === null || user === undefined) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    const id = mongoose.Types.ObjectId()
    const data = { content: request.body.content, id }
    blog.comments.push(data)
    await blog.save()
    response.send(blog)
})

module.exports = blogsRouter