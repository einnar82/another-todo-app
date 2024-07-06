import React, { useState } from 'react';
import { Button, TextInput, Textarea, Select, Modal, Label, Card, Tooltip } from 'flowbite-react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const App = () => {
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
    setTodos(todos.filter(todo => todo.id !== id));
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

  const filteredTodos = filterLabel ? todos.filter(todo => todo.labels.includes(filterLabel)) : todos;

  const uniqueLabels = [...new Set(todos.flatMap(todo => todo.labels.split(',').map(label => label.trim())))];

  const openModal = () => {
    setTitle('');
    setDescription('');
    setLabels('');
    setColor('#ffffff');
    setEditId(null);
    setShowModal(true);
    setErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Notes</h1>
        <div className="flex justify-between items-center mb-6">
          <div className="flex-grow mr-2">
            <Label htmlFor="filter" className="block mb-2 text-sm font-medium text-gray-900">
              Filter by label
            </Label>
            <Select
              id="filter"
              value={filterLabel}
              onChange={(e) => setFilterLabel(e.target.value)}
              placeholder="Filter by label"
              className="w-full"
            >
              <option value="">#All</option>
              {uniqueLabels.map((label, index) => (
                <option key={index} value={label}>#{label}</option>
              ))}
            </Select>
          </div>
          <Tooltip content="Add new note">
            <Button onClick={openModal} className="h-10 mt-6">+</Button>
          </Tooltip>
        </div>
        <Modal show={showModal} onClose={closeModal}>
          <Modal.Header>
            {editId ? 'Edit Note' : 'Add Note'}
          </Modal.Header>
          <Modal.Body>
            <div className="mb-4">
              <TextInput
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-2"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-2"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              <TextInput
                placeholder="Labels (comma or space separated)"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                className="mb-2"
              />
              {errors.labels && <p className="text-red-500 text-sm">{errors.labels}</p>}
              <p className="text-gray-500 text-sm">Enter labels separated by commas or spaces (e.g., work personal urgent)</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Tooltip content={editId ? "Update note" : "Add note"}>
              <Button onClick={editId ? handleUpdateTodo : handleAddTodo}>
                {editId ? 'Update Note' : 'Add Note'}
              </Button>
            </Tooltip>
            <Button color="gray" onClick={closeModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTodos.map(todo => (
            <Card key={todo.id} className={`relative ${todo.color}`}>
              <div className="absolute top-2 left-2">
                <Tooltip content="Mark as complete">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="mr-2"
                  />
                </Tooltip>
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <Tooltip content="Edit note">
                  <button onClick={() => handleEditTodo(todo.id)} className="text-blue-500">
                    <FaEdit />
                  </button>
                </Tooltip>
                <Tooltip content="Delete note">
                  <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500">
                    <FaTrash />
                  </button>
                </Tooltip>
              </div>
              <div className="pt-8">
                <h3 className={`text-lg font-bold ${todo.completed ? 'line-through' : ''} break-words`}>{todo.title}</h3>
                <p className={`text-sm ${todo.completed ? 'line-through' : ''} break-words`}>{todo.description}</p>
                <p className={`text-sm text-gray-500 ${todo.completed ? 'line-through' : ''}`}>{todo.date}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {todo.labels.split(',').map((label, index) => (
                    <span key={index} className={`text-gray-500 ${todo.completed ? 'line-through' : ''} break-words`}>#{label.trim()}</span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
