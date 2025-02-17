import React, { useCallback } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Card, Tooltip } from 'flowbite-react';
import { useTodos } from '../contexts/TodoContext';

const TodoCard = ({ todo }) => {
  const { toggleComplete, handleEditTodo, handleDeleteTodo } = useTodos();
  const completedAt = todo.completed_at !== null

  const formattedDate = useCallback((isoString) => {
    const date = new Date(isoString);

    const options = {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      timeZoneName: 'short'
    };
    
    return date.toLocaleDateString('en-US', options);
  }, [])

  return (
    <Card className={`relative ${todo.color}`}>
      <div className="absolute top-2 left-2">
        <Tooltip content="Mark as complete">
          <input
            type="checkbox"
            checked={completedAt}
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
        <h5 className="text-xs text-gray-500">{formattedDate(todo.created_at)}</h5>
        <h3 className={`text-lg font-bold ${completedAt ? 'line-through' : ''} break-words`}>{todo.title}</h3>
        <p className={`text-sm ${completedAt ? 'line-through' : ''} break-words`}>{todo.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {todo.labels.map((label, index) => (
            <span key={index} className={`text-gray-500 ${completedAt ? 'line-through' : ''} break-words`}>#{label.trim()}</span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TodoCard;
