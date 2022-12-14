const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
require('express-async-errors')

usersRouter.post('/', async (request, response) => {
    const body = request.body
    if (!body.password) {
        response.status(400).json({ error: "User validation failed: password: Path `password` is required." })
        return
    } else if (body.password.length < 3) {
        response.status(400).json({ error: `User validation failed: username: Path \`password\` (\`${body.password ?? ''}\`) is shorter than the minimum allowed length (3).` })
        return
    }
    const passwordHash = await bcrypt.hash(body.password, 10)
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })
    const savedUser = await user.save()
    response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
    response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter