import React from 'react';
import { Button, Select, Label, Tooltip } from 'flowbite-react';
import TodoModal from './TodoModal';
import TodoCard from './TodoCard';
import { useTodos } from '../contexts/TodoContext';

const TodoApp = () => {
  const {
    todos,
    title,
    description,
    editId,
    labels,
    filterLabel,
    showModal,
    errors,
    setErrors,
    setTitle,
    setDescription,
    setLabels,
    setFilterLabel,
    setShowModal,
    handleAddTodo,
    handleEditTodo,
    handleUpdateTodo,
    handleDeleteTodo,
    toggleComplete,
    colors,
  } = useTodos();

  const filteredTodos = filterLabel ? todos.filter(todo => todo.labels.includes(filterLabel)) : todos;

  const uniqueLabels = [...new Set(todos.flatMap(todo => {
    let labels = todo.labels ?? [];
    return labels.map(label => label.trim())
  }))];

  const openModal = () => {
    setTitle('');
    setDescription('');
    setLabels('');
    setShowModal(true);
    setErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
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
        <TodoModal
          show={showModal}
          onClose={closeModal}
          onSubmit={editId ? handleUpdateTodo : handleAddTodo}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTodos.map((todo, index) => (
            <TodoCard
              key={index}
              todo={todo}
              onToggleComplete={() => toggleComplete(todo.id)}
              onEdit={() => handleEditTodo(todo.id)}
              onDelete={() => handleDeleteTodo(todo.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
