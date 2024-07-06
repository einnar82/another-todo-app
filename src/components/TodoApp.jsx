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
    editId
  } = useTodos();

  const filteredTodos = filterLabel ? todos.filter(todo => todo.labels.includes(filterLabel)) : todos;

  const uniqueLabels = [...new Set(todos.flatMap(todo => todo.labels.split(',').map(label => label.trim())))];

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
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          labels={labels}
          setLabels={setLabels}
          errors={errors}
          editId={editId}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTodos.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggleComplete={toggleComplete}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
