import React, { useState, useEffect } from 'react';
import './TodoList.css'; // We'll create this CSS file

function TodoList() {
    const [tasks, setTasks] = useState(() => {
        // Initialize tasks from localStorage, or an empty array if none
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'completed', 'active'
    const [sortOrder, setSortOrder] = useState('default'); // 'default', 'asc', 'desc'

    // Effect to save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = (e) => {
        e.preventDefault(); // Prevent form submission default behavior
        if (newTask.trim() === '') {
            alert('Task cannot be empty!');
            return;
        }
        const newId = Date.now(); // Simple unique ID
        setTasks([...tasks, { id: newId, text: newTask.trim(), completed: false }]);
        setNewTask('');
    };

    const handleRemoveTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleToggleComplete = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleClearCompleted = () => {
        setTasks(tasks.filter(task => !task.completed));
    };

    // Filtering logic
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') {
            return task.completed;
        } else if (filter === 'active') {
            return !task.completed;
        }
        return true; // 'all'
    });

    // Sorting logic
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.text.localeCompare(b.text);
        } else if (sortOrder === 'desc') {
            return b.text.localeCompare(a.text);
        }
        return 0; // 'default' - maintains original order within filtered set
    });

    return (
        <div className="todo-list-container">
            <h1>My To-Do List</h1>

            <form onSubmit={handleAddTask} className="task-input-form">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                />
                <button type="submit">Add Task</button>
            </form>

            <div className="controls">
                <div className="filter-buttons">
                    <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
                    <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
                    <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
                </div>

                <div className="sort-buttons">
                    <label htmlFor="sortOrder">Sort by:</label>
                    <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="default">Default</option>
                        <option value="asc">A-Z</option>
                        <option value="desc">Z-A</option>
                    </select>
                </div>
            </div>

            {sortedTasks.length === 0 && <p className="no-tasks">No tasks to display.</p>}

            <ul className="task-list">
                {sortedTasks.map(task => (
                    <li key={task.id} className={task.completed ? 'completed' : ''}>
                        <span onClick={() => handleToggleComplete(task.id)}>
                            {task.text}
                        </span>
                        <button onClick={() => handleRemoveTask(task.id)}>Remove</button>
                    </li>
                ))}
            </ul>

            {tasks.some(task => task.completed) && (
                <button onClick={handleClearCompleted} className="clear-completed-button">
                    Clear Completed
                </button>
            )}
        </div>
    );
}

export default TodoList;