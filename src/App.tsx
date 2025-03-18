import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { ChangeEvent, FormEvent, useState } from 'react';
import { TodoList } from './components/TodoList';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  user: User;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

type Error = {
  input: boolean;
  select: boolean;
};

const findUser = (id: number) => {
  return (
    usersFromServer.find(user => id === user.id) || {
      id: 0,
      name: '',
      username: '',
      email: '',
    }
  );
};

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>(
    todosFromServer.map(todo => ({
      ...todo,
      user: findUser(todo.userId),
    })),
  );

  const [inputValue, setInputValue] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('0');
  const [error, setError] = useState<Error>({
    input: false,
    select: false,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = {
      input: inputValue.trim() === '',
      select: selectedUser === '0',
    };

    setError(newErrors);

    if (newErrors.input || newErrors.select) {
      return;
    }

    const newId = todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1;
    const searchedUser = usersFromServer.find(
      user => user.id === +selectedUser,
    );

    if (!searchedUser) {
      return;
    }

    const newTodo = {
      id: newId,
      title: inputValue,
      completed: false,
      userId: searchedUser.id,
      user: searchedUser,
    };

    setTodos(prevTodo => [...prevTodo, newTodo]);
    setInputValue('');
    setSelectedUser('0');
  };

  const handleInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setError({ ...error, input: false });
  };

  const handelSelectUser = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);
    setError({ ...error, select: false });
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        onSubmit={event => handleSubmit(event)}
        action="/api/todos"
        method="POST"
      >
        <div className="field">
          <input
            onChange={event => handleInputValue(event)}
            value={inputValue}
            type="text"
            data-cy="titleInput"
            placeholder="Enter a title"
          />
          {error.input && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <select
            value={selectedUser}
            onChange={event => handelSelectUser(event)}
            data-cy="userSelect"
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {error.select && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>
      <TodoList todos={todos} />
    </div>
  );
};
