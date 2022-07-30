import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
    title: 'This is the title of the blog post.',
    author: 'Default Author Name',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    likes: 98421,
    user: {
        name: 'John Doe',
        username: 'xX_john_Xx',
        id: 'mongooseId'
    }
}
const user1 = {
    name: 'John Doe',
    username: 'xX_john_Xx',
    id: 'mongooseId'
}

test('renders right fields by default', () => { //Title, author, NOT url, NOT likes
    const component = render(
        <Blog blog={blog} user={user1} />
    )
    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)
    expect(component.container).not.toHaveTextContent(blog.url)
    expect(component.container).not.toHaveTextContent(blog.likes)
})

test('also render additional fields on button', () => {
    const component = render(
        <Blog blog={blog} user={user1} />
    )
    const button = component.getByText('view')
    fireEvent.click(button)
    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)
    expect(component.container).toHaveTextContent(blog.url)
    expect(component.container).toHaveTextContent(blog.likes)
})

test('like handler function called twice when like pressed twice', () => {
    const mockHandler = jest.fn()
    const component = render(
        <Blog blog={blog} user={user1} likeCallback={mockHandler}/>
    )
    let button = component.getByText('view')
    fireEvent.click(button)
    button = component.getByText('like')
    fireEvent.click(button)
    expect(mockHandler.mock.calls).toHaveLength(1)
    fireEvent.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
})