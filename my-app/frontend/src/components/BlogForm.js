import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')
    return (
        <form id="form" onSubmit={(event) => {
            event.preventDefault()
            const newBlog = {
                title: newTitle,
                author: newAuthor,
                url: newUrl
            }
            createBlog(newBlog)
            setNewAuthor('')
            setNewTitle('')
            setNewUrl('')
        }}>
            <h2>create new</h2>
            title:<input id="title" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} /><br />
            author:<input id="author" value={newAuthor} onChange={(event) => setNewAuthor(event.target.value)} /><br />
            url:<input id="url" value={newUrl} onChange={(event) => setNewUrl(event.target.value)} /><br />
            <button id="submit" type='submit'>create</button>
        </form>)
}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm