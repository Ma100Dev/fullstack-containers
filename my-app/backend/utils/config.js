require('dotenv').config()
const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI || 'mongodb://localhost/bloglist'
const ENV = process.env.NODE_ENV || 'production'
const JWT_SECRET = process.env.SECRET
module.exports = {
    PORT,
    MONGODB_URI,
    ENV,
    JWT_SECRET
}