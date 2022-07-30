import React, { useState } from 'react'
import blogs from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, likeCallback }) => {
    const [fullView, setFullView] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
        paddingBottom: 2,
    }
    return deleted ?
        null :
        (
            <div className="blog" style={blogStyle}>
                {blog.title}, {blog.author} <button onClick={() => setFullView(!fullView)}>{fullView ? 'hide' : 'view'}</button>
                {fullView ?
                    (
                        <div>
                            <a href={blog.url}>{blog.url}</a><br />
                            likes {blog.likes} <button onClick={
                                async () => {
                                    if (likeCallback !== undefined) {
                                        likeCallback()
                                    } else {
                                        await blogs.update({
                                            user: blog.user.id,
                                            likes: blog.likes + 1,
                                            author: blog.author,
                                            title: blog.title,
                                            url: blog.url
                                        }, blog.id)
                                        blog.likes++
                                        setFullView(false)
                                        setTimeout(() => setFullView(true), 1)
                                    }
                                }
                            }>like</button><br />
                            {blog.user.name}<br />
                            {blog.user.username === user.username ?
                                <button id={`remove_${blog.title.replace(/\s/g, '')}`} onClick={async () => {
                                    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
                                        return
                                    }
                                    blogs.setToken(user.token)
                                    await blogs.remove(blog.id)
                                    setDeleted(true)
                                }}>remove</button> :
                                null}
                        </div>
                    ) : null}
            </div>
        )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    likeCallback: PropTypes.func
}

export default Blog