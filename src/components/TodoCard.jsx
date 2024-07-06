import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Card, Tooltip } from 'flowbite-react';

const TodoCard = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  return (
    <Card className={`relative ${todo.color}`}>
      <div className="absolute top-2 left-2">
        <Tooltip content="Mark as complete">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id)}
            className="mr-2"
          />
        </Tooltip>
      </div>
      <div className="absolute top-2 right-2 flex space-x-2">
        <Tooltip content="Edit note">
          <button onClick={() => onEdit(todo.id)} className="text-blue-500">
            <FaEdit />
          </button>
        </Tooltip>
        <Tooltip content="Delete note">
          <button onClick={() => onDelete(todo.id)} className="text-red-500">
            <FaTrash />
          </button>
        </Tooltip>
      </div>
      <div className="pt-8">
        <h3 className={`text-lg font-bold ${todo.completed ? 'line-through' : ''} break-words`}>{todo.title}</h3>
        <p className={`text-sm ${todo.completed ? 'line-through' : ''} break-words`}>{todo.description}</p>
        <p className="text-sm text-gray-500">{todo.date}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {todo.labels.split(',').map((label, index) => (
            <span key={index} className={`text-gray-500 ${todo.completed ? 'line-through' : ''} break-words`}>#{label.trim()}</span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TodoCard;
