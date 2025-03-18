import { Todo } from '../../App';
import { TodoInfo } from '../TodoInfo';

type Prop = {
  todos: Todo[];
};

export const TodoList = ({ todos = [] }: Prop) => {
  return (
    <section className="TodoList">
      {todos.map(todo => (
        <TodoInfo key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
