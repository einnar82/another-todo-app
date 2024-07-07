import React from 'react';
import { Button, TextInput, Textarea, Modal, Tooltip } from 'flowbite-react';
import { useTodos } from '../contexts/TodoContext';

const TodoModal = ({ show, onClose, onSubmit }) => {
  const { title, setTitle, description, setDescription, labels, setLabels, errors, editId } = useTodos();

  return (
    <Modal show={show} onClose={onClose}>
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
            placeholder="Labels (space separated)"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            className="mb-2"
          />
          {errors.labels && <p className="text-red-500 text-sm">{errors.labels}</p>}
          <p className="text-gray-500 text-sm">Enter labels separated by spaces (e.g., work personal urgent)</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Tooltip content={editId ? "Update note" : "Add note"}>
          <Button onClick={onSubmit}>
            {editId ? 'Update Note' : 'Add Note'}
          </Button>
        </Tooltip>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TodoModal;
