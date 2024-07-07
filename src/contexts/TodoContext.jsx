import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from './../api/index';
import { debounce } from '../utils';

const TodoContext = createContext();

export const useTodos = () => {
  return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uniqueLabels, setUniqueLabels] = useState([]); 
  const [labels, setLabels] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [editId, setEditId] = useState(null);
  const [filterLabel, setFilterLabel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const colors = useMemo(() => ['bg-yellow-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-purple-100', 'bg-red-100']);

  const fetchTodos = async (filterLabel) => {
    try {
      const params = filterLabel !== '' ?
      {
        params: {
          label: filterLabel
        }
      } : {}
      const response = await api.get('/tasks', params);
      setTodos(response.data.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const debouncedFetchTodos = useCallback(debounce(fetchTodos, 500), []);

  useEffect(() => {
    debouncedFetchTodos(filterLabel);
  }, [filterLabel, debouncedFetchTodos]);

  useEffect(() => {
    fetchUniqueLabels();
  }, []);

  const validateFields = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    if (!description.trim()) {
      errors.description = 'Description is required';
    }

    if (labels.length === 0) {
      errors.labels = 'Labels are required';
    }
    return errors;
  };

  const formatLabels = (labels) => {
    return labels.split(/[ ,]+/).map(label => label.trim()).filter(label => label);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const handleAddTodo = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const formattedLabels = formatLabels(labels);
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const currentDate = formatDate(new Date());

    try {
      const response = await api.post('/tasks', {
        title,
        description,
        labels: formattedLabels,
        date: currentDate,
        color: randomColor,
        completed: false
      });

      fetchTodos(filterLabel);
      fetchUniqueLabels(); // Refresh unique labels
      setTitle('');
      setDescription('');
      setLabels('');
      setShowModal(false);
      setErrors({});
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTodos(filterLabel);
      fetchUniqueLabels(); // Refresh unique labels

      // Reset filter if no notes left after deletion
      if (!todos.some(todo => todo.labels.includes(filterLabel))) {
        setFilterLabel('');
      }

      fetchTodos(filterLabel);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditTodo = async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      const todo = response.data.data;
      setTitle(todo.title);
      setDescription(todo.description);
      setLabels(todo.labels.join(" "));
      setColor(todo.color);
      setEditId(id);
      setShowModal(true);
    } catch (error) {
      console.error('Error getting todo:', error);
    }
  };

  const handleUpdateTodo = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formattedLabels = formatLabels(labels);

    try {
      const response = await api.put(`/tasks/${editId}`, {
        title,
        description,
        labels: formattedLabels,
        color
      });

      fetchTodos(filterLabel);
      fetchUniqueLabels(); // Refresh unique labels
      setTitle('');
      setDescription('');
      setLabels('');
      setEditId(null);
      setShowModal(false);
      setErrors({});
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const toggleComplete = async (id) => {
    const todo = todos.find(todo => todo.id === id);
    const date = new Date();
    const completedAt = todo.completed_at === null ? date.toISOString().slice(0, 19).replace('T', ' ') : null;
    try {
      const response = await api.put(`/tasks/${id}`, {
        ...todo,
        completed_at: completedAt
      });

      fetchTodos(filterLabel);
      fetchUniqueLabels(); // Refresh unique labels
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };


  const fetchUniqueLabels = async () => {
    try {
      const response = await api.get('/labels');
      setUniqueLabels(response.data);
    } catch (error) {
      console.error('Error fetching unique labels:', error);
    }
  };


  const value = useMemo(() => ({
    todos,
    title,
    description,
    labels,
    color,
    colors,
    editId,
    filterLabel,
    showModal,
    errors,
    uniqueLabels,
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
    formatLabels,
    formatDate,
  }), [todos, title, description, labels, color, editId, filterLabel, showModal, errors, colors, uniqueLabels]);


  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
