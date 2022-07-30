import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

import './index.css'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState(null)
    const [success, setSuccess] = useState(false)
    const blogFormRef = useRef()
    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password, })
            setUser(user)
            window.localStorage.setItem('user', JSON.stringify(user))
            setUsername('')
            setPassword('')
            setSuccess(true)
            setMessage(`Welcome ${user.name}`)
            setTimeout(() => { setMessage(null) }, 5000)
        } catch (exception) {
            setSuccess(false)
            setMessage('wrong credentials entered!')
            setTimeout(() => { setMessage(null) }, 5000)
        }
    }
    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
        setUser(JSON.parse(window.localStorage.getItem('user')) || null)
    }, [])

    const loginForm = () => (<form onSubmit={handleLogin}>
        <div>
            username
            <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
            password
            <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
    </form>)

    const createBlog = async (newBlog) => {
        blogFormRef.current.toggleVisibility()
        blogService.setToken(user.token)
        try {
            await blogService.addNew(newBlog)
        } catch (error) {
            console.error(error)
            setSuccess(false)
            setMessage(`Failed to add ${newBlog.title} by ${newBlog.author}: ${error}`)
            setTimeout(() => { setMessage(null) }, 5000)
            return
        }
        setSuccess(true)
        setMessage(`A new blog ${newBlog.title} by ${newBlog.author} added`)
        setTimeout(() => { setMessage(null) }, 5000)
        setBlogs(await blogService.getAll())
    }

    const blogView = () => (<>
        <h2>blogs</h2>
        <p>
            {user.name} logged in
            <button onClick={() => {
                window.localStorage.removeItem('user')
                setUser(null)
                setSuccess(true)
                setMessage('successfully logged out')
                setTimeout(() => { setMessage(null) }, 5000)
            }}>logout</button>
        </p>
        <Togglable buttonLabel="create new blog" ref={blogFormRef} id="create">
            <BlogForm createBlog={createBlog} />
        </Togglable> <br />
        <div id='blogsList'>
            {blogs
                .sort((a, b) => b.likes - a.likes) //Järjestetään likejen mukaan TULLESSA SIVULLE, ei muulloin. "Hyppivät" tulokset olisivat epäkäytännöllisiä.
                .map(blog =>
                    <Blog key={blog.id} blog={blog} user={user} />
                )}
        </div>
    </>)

    return (
        <div>
            <Notification message={message} wasSuccess={success} />
            {user === null ?
                loginForm() :
                blogView()
            }
        </div>
    )
}

export default App