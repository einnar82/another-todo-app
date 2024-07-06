import React, { createContext, useContext, useState } from 'react';

const TodoContext = createContext();

export const useTodos = () => {
  return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [editId, setEditId] = useState(null);
  const [filterLabel, setFilterLabel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const colors = ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100', 'bg-red-100'];

  const validateFields = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    if (!description.trim()) {
      errors.description = 'Description is required';
    }
    if (!labels.trim()) {
      errors.labels = 'Labels are required';
    }
    return errors;
  };

  const formatLabels = (labels) => {
    return labels.split(/[ ,]+/).map(label => label.trim()).filter(label => label).join(', ');
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const handleAddTodo = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formattedLabels = formatLabels(labels);
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const currentDate = formatDate(new Date());
    setTodos([...todos, { id: Date.now(), title, description, labels: formattedLabels, date: currentDate, color: randomColor, completed: false }]);
    setTitle('');
    setDescription('');
    setLabels('');
    setShowModal(false);
    setErrors({});
  };

  const handleDeleteTodo = (id) => {
    setTodos(prevTodos => {
      const updatedTodos = prevTodos.filter(todo => todo.id !== id);
      return updatedTodos;
    });

    // Reset filter if no notes left after deletion
    if (!todos.some(todo => todo.labels.includes(filterLabel))) {
      setFilterLabel('');
    }
  };

  const handleEditTodo = (id) => {
    const todo = todos.find(todo => todo.id === id);
    setTitle(todo.title);
    setDescription(todo.description);
    setLabels(todo.labels);
    setColor(todo.color);
    setEditId(id);
    setShowModal(true);
  };

  const handleUpdateTodo = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formattedLabels = formatLabels(labels);
    setTodos(todos.map(todo => 
      todo.id === editId ? { ...todo, title, description, labels: formattedLabels, color } : todo
    ));
    setTitle('');
    setDescription('');
    setLabels('');
    setEditId(null);
    setShowModal(false);
    setErrors({});
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const value = {
    todos,
    title,
    description,
    labels,
    color,
    editId,
    filterLabel,
    showModal,
    errors,
    setTitle,
    setDescription,
    setLabels,
    setColor,
    setEditId,
    setFilterLabel,
    setShowModal,
    setErrors,
    handleAddTodo,
    handleDeleteTodo,
    handleEditTodo,
    handleUpdateTodo,
    toggleComplete,
    colors,
    formatLabels,
    formatDate,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
