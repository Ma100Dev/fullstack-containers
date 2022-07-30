const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
let api = null
let token = null
let user = null

beforeAll(async () => {
    api = await supertest(app)
})

beforeEach(async () => {
    await User.deleteMany({})
    const pwd = await bcrypt.hash("newPassword", 10)
    const usr = await new User({
        "username": "newUser",
        "passwordHash": pwd,
        "name": "New User"
    }).save()
    user = usr
    const response = await api.post('/api/login')
        .send({
            "username": "newUser",
            "password": "newPassword"
        })
    token = `bearer ${response.body.token}`
})

describe('with pre-filled database', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        const initialBlogs = helper.initialBlogs
        initialBlogs.forEach((item) => {
            item.user = user
        })
        await Blog.insertMany(initialBlogs)
    })
    describe('getting all blogs', () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })
        test('right amount of blogs returned', async () => {
            const response = await api.get('/api/blogs')
            expect(response.body).toHaveLength(helper.initialBlogs.length)
        })
    })
    describe('toJSON works', () => {
        test('identifying field is id and not _id', async () => {
            let blog = await api.get('/api/blogs')
            blog = blog.body[0]
            expect(blog._id).not.toBeDefined()
            expect(blog.id).toBeDefined()
        })
    })
    describe('deletion', () => {
        test('deleting existing blog gives http 204 and deletes', async () => {
            let response = await api.get('/api/blogs')
            const selected = response.body[0]
            response = await api.delete(`/api/blogs/${selected.id}`).set('Authorization', token)
                .expect(204)
            response = await api.get('/api/blogs')
            expect(response.body).not.toEqual(expect.arrayContaining([selected]))
        })
    })
    describe('updating', () => {
        test('updating a blog\'s like count works', async () => {
            let response = await api.get('/api/blogs')
            const selected = response.body[0]
            selected.likes = selected.likes + 100
            response = await api.put(`/api/blogs/${selected.id}`)
                .send({ likes: selected.likes })
                .expect(200)
            response = await api.get('/api/blogs')
            expect(response.body).toEqual(expect.arrayContaining([selected]))
        })
    })
})


describe('adding blogs', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
    })
    test('blog length increases', async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)

        await api.post('/api/blogs').send(helper.oneBlog).set('Authorization', token)
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    })
    test('blog has expected content in response and afterwards', async () => {
        let response = await api.post('/api/blogs').send(helper.oneBlog).set('Authorization', token)
        response = response.body
        expect(response.title).toEqual(helper.oneBlog.title)
        expect(response.author).toEqual(helper.oneBlog.author)
        expect(response.url).toEqual(helper.oneBlog.url)
        expect(response.likes).toEqual(helper.oneBlog.likes)
        const newResponse = await api.get('/api/blogs')
        expect(newResponse.body.map(item => item.id)).toContain(response.id)
    })
    test('if title is empty, get HTTP 400', async () => {
        let blog = Object.assign({}, helper.oneBlog)
        delete blog.title
        await api.post('/api/blogs')
            .send(blog)
            .set('Authorization', token)
            .expect(400)
    })
    test('if url is empty, get HTTP 400', async () => {
        let blog = Object.assign({}, helper.oneBlog)
        delete blog.url
        await api.post('/api/blogs')
            .send(blog)
            .set('Authorization', token)
            .expect(400)
    })
    test('if url AND title are empty, get HTTP 400', async () => {
        let blog = Object.assign({}, helper.oneBlog)
        delete blog.url
        delete blog.title
        await api.post('/api/blogs')
            .send(blog)
            .set('Authorization', token)
            .expect(400)
    })
    test('if unauthenticated, get HTTP 401', async () => {
        await api.post('/api/blogs')
            .send(helper.oneBlog)
            .expect(401)
    })
})

describe('default is inserted', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
    })
    test('if likes is undefined, make it 0', async () => {
        let blog = Object.assign({}, helper.oneBlog)
        delete blog.likes
        let response = await api.post('/api/blogs')
            .send(blog)
            .set('Authorization', token)
        response = response.body
        expect(response.likes).toBe(0)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
}, 10000)