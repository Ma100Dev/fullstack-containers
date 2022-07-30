import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('callback function called with right object', () => {
    const mockHandler = jest.fn()
    const component = render(
        <BlogForm createBlog={mockHandler} />
    )
    const title = component.container.querySelector('#title')
    fireEvent.change(title, {
        target: {
            value: 'This is the title of the blog post.'
        }
    })
    const author = component.container.querySelector('#author')
    fireEvent.change(author, {
        target: {
            value: 'Default Author Name'
        }
    })
    const url = component.container.querySelector('#url')
    fireEvent.change(url, {
        target: {
            value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
    })
    const button = component.getByText('create')
    fireEvent.click(button)
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0]).toEqual({
        title: 'This is the title of the blog post.',
        author: 'Default Author Name',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    })
})