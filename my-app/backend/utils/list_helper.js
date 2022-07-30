const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((previous, current) => {
        return previous + current.likes
    }, 0) || 0
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((previous, current) => {
        return (previous.likes > current.likes) ? previous : current
    })

}

const mostBlogs = (blogs) => {
    let bloggers = []
    blogs.forEach((item) => {
        let author = bloggers.filter(b => {
            return b.author === item.author
        })
        if (author.length > 0) {
            author[0].blogs = author[0].blogs + 1
        } else {
            bloggers = bloggers.concat({ author: item.author, blogs: 1 })
        }
    })
    return bloggers.reduce((previous, current) => {
        return (previous.blogs > current.blogs) ? previous : current
    })
}

const mostLikes = (blogs) => {
    let bloggers = []
    blogs.forEach((item) => {
        let author = bloggers.filter(b => {
            return b.author === item.author
        })
        if (author.length > 0) {
            author[0].likes = author[0].likes + item.likes
        } else {
            bloggers = bloggers.concat({ author: item.author, likes: item.likes })
        }
    })
    return bloggers.reduce((previous, current) => {
        return (previous.likes > current.likes) ? previous : current
    })
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}