import React from 'react';
import ReactDOM from 'react-dom';
import Todo from '../../Todos/Todo';
import { render } from '@testing-library/react'

describe('Todo', () => {
    const defaultTodo = { text: 'test', done: false };
    const onClickComplete = () => null;
    const onClickDelete = () => null;
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Todo todo={defaultTodo} onClickComplete={onClickComplete} onClickDelete={onClickDelete} />, div);
    });
    it('renders with text', async () => {
        const { findAllByText } = render(<Todo todo={defaultTodo} onClickComplete={onClickComplete} onClickDelete={onClickDelete} />);
        expect(await findAllByText('test')).toBeTruthy();
    });
    it('renders as not done', async () => {
        const { findAllByText } = render(<Todo todo={defaultTodo} onClickComplete={onClickComplete} onClickDelete={onClickDelete} />);
        expect(await findAllByText('This todo is not done')).toBeTruthy();
    });
    it('renders as done', async () => {
        const todo = { ...defaultTodo, done: true };
        const { findAllByText } = render(<Todo todo={todo} onClickComplete={onClickComplete} onClickDelete={onClickDelete} />);
        expect(await findAllByText('This todo is done')).toBeTruthy();
    });
});