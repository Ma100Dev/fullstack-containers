const dummy = require('../utils/list_helper').dummy
const totalLikes = require('../utils/list_helper').totalLikes
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes

const defaultBlogs =
    [{
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }]

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

describe('dummy', () => {
    test('dummy returns one', () => {
        const blogs = []
        expect(dummy(blogs)).toBe(1)
    })
})

describe('total likes', () => {
    const blogs = [...defaultBlogs] //Simuloi järkevää testiryhmän valmitelua
    test('when list has only one blog, equals the likes of that', () => {
        expect(totalLikes([...listWithOneBlog])).toBe(5)
    })
    test('when list has several blogs, equals sum of likes', () => {
        expect(totalLikes(blogs)).toBe(36)
    })
    test('when list is empty, equals 0', () => {
        expect(totalLikes([])).toBe(0)
    })
})

describe('favorite blog', () => {
    let blogs = [...defaultBlogs]
    test('when list has several blogs, equals most liked one', () => {
        expect(favoriteBlog(blogs)).toEqual({
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        })
    })
    blogs.concat({
        _id: "61c363578a368c91829e8abf",
        title: "New Object Later In List",
        author: "Wrong Guy",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        likes: 12,
        __v: 0
    })
    test('if several have most likes, equals the \'first\' one', () => {
        expect(favoriteBlog(blogs)).toEqual({
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        })
    })
})

describe('most blogs by blogger', () => {
    const blogs = [...defaultBlogs]
    test('when list has one blog, return its publisher', () => {
        expect(mostBlogs([blogs[0]])).toEqual({
            author: "Michael Chan",
            blogs: 1
        })
    })
    test('when list has several blogs, equals most common publisher', () => {
        expect(mostBlogs(blogs)).toEqual({
            author: "Robert C. Martin",
            blogs: 3
        })
    })
})

describe('most likes to blogger', () => {
    const blogs = [...defaultBlogs]
    test('when list has one blog, return its publisher', () => {
        expect(mostLikes([blogs[0]])).toEqual({
            author: "Michael Chan",
            likes: 7
        })
    })
    test('when list has several blogs, equals publisher with most likes', () => {
        expect(mostLikes(blogs)).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })
})