import React from 'react';
import { Button, Select, Label, Tooltip } from 'flowbite-react';
import TodoModal from './TodoModal';
import TodoCard from './TodoCard';
import { useTodos } from '../contexts/TodoContext';

const TodoApp = () => {
  const {
    todos,
    editId,
    filterLabel,
    currentPage,
    uniqueLabels,
    hasMorePages,
    setCurrentPage,
    showModal,
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
    toggleComplete
  } = useTodos();
 
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

  const handleFilterChange = (value) => {
    setFilterLabel(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  console.log('rendering')
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
              onChange={(e) => handleFilterChange(e.target.value)}
              placeholder="Filter by label"
              className="w-full"
            >
              <option value="">All</option>
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
          {todos.map((todo, index) => (
            <TodoCard
              key={index}
              todo={todo}
              onToggleComplete={() => toggleComplete(todo.id)}
              onEdit={() => handleEditTodo(todo.id)}
              onDelete={() => handleDeleteTodo(todo.id)}
            />
          ))}
        </div>
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>{`Page ${currentPage}`}</span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasMorePages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TodoApp);
