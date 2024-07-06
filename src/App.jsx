import React from 'react';
import TodoApp from './components/TodoApp';
import { TodoProvider } from './contexts/TodoContext';

const App = () => {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  );
};

export default App;
