Installation:

Bash

npm install --save-dev @testing-library/react @testing-library/jest-dom jest
# or
yarn add --dev @testing-library/react @testing-library/jest-dom jest
You might also need to configure jest for React. If you created your app with Create React App, it's usually set up for you.

Example Test File (TodoList.test.js):

JavaScript

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from './TodoList'; // Adjust path

// Clear localStorage before each test to ensure isolation
beforeEach(() => {
  localStorage.clear();
});

test('renders "My To-Do List" heading', () => {
  render(<TodoList />);
  expect(screen.getByText(/my to-do list/i)).toBeInTheDocument();
});

test('allows adding a new task', () => {
  render(<TodoList />);
  const input = screen.getByPlaceholderText(/add a new task/i);
  const addButton = screen.getByRole('button', { name: /add task/i });

  fireEvent.change(input, { target: { value: 'Buy groceries' } });
  fireEvent.click(addButton);

  expect(screen.getByText(/buy groceries/i)).toBeInTheDocument();
  expect(input).toHaveValue(''); // Input should be cleared
});

test('shows error if task input is empty', () => {
  render(<TodoList />);
  const addButton = screen.getByRole('button', { name: /add task/i });

  fireEvent.click(addButton); // Click without typing

  expect(screen.getByText(/task cannot be empty/i)).toBeInTheDocument();
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument(); // No task should be added
});

test('allows marking a task as complete', () => {
  render(<TodoList />);
  const input = screen.getByPlaceholderText(/add a new task/i);
  const addButton = screen.getByRole('button', { name: /add task/i });

  fireEvent.change(input, { target: { value: 'Learn React' } });
  fireEvent.click(addButton);

  const taskItem = screen.getByText(/learn react/i);
  fireEvent.click(taskItem); // Click to complete

  expect(taskItem).toHaveClass('completed');
});

// You would add more tests for filtering, sorting, removal, and localStorage persiste
