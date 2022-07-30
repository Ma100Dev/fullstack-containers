const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
//require('express-async-errors')

const errorHandler = (error, request, response, next) => {
    logger.error(error.name)
    if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error)
}

const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    let token = null
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
    }
    if (!token) {
        request.user = null
        next()
        return
    }
    const decoded = jwt.verify(token, config.JWT_SECRET)
    if (!decoded || !decoded.id) {
        request.user = null
        next()
        return
    }
    const user = await User.findById(decoded.id)
    request.user = user
    next()
}

module.exports = {
    userExtractor,
    errorHandler
}