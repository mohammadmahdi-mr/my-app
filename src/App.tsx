import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Todo } from "./types/todos";

const LOCAL_STORAGE_TODO_KEY = "LOCAL_STORAGE_TODO_KEY";

function App() {
  const isMountingRef = useRef(false);

  const [todos, setTodos] = useState<(Todo & { isEditing: boolean })[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [tempEditingTodo, setTempEditingTodo] = useState<{
    title: string;
    id: string;
  }>({ title: "", id: "" });

  useEffect(() => {
    const localTodos = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_TODO_KEY) ?? "[]"
    );

    setTodos(localTodos);
  }, []);

  useEffect(() => {
    if (isMountingRef.current) {
      localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify(todos));
    } else {
      isMountingRef.current = true;
    }
  }, [todos]);

  function handleTodoCheck(id: string) {
    setTodos((prev) => {
      return prev.map((todo) => {
        return todo.id === id ? { ...todo, isDone: !todo.isDone } : todo;
      });
    });
  }

  const handleNewTodoChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setNewTodo(e.currentTarget.value);
  };

  const handleEditingTodoChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setTempEditingTodo((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleEditingTodoSubmit = () => {
    setTodos((prev) => {
      return prev.map((todo) => {
        return todo.id === tempEditingTodo.id
          ? { ...todo, title: tempEditingTodo.title }
          : todo;
      });
    });
    setTempEditingTodo({ id: "", title: "" });
  };

  const addNewTodo = () => {
    setTodos((prev) => {
      return prev.concat({
        title: newTodo,
        isDone: false,
        id: Math.round(Math.random() * 1000).toString(),
        isEditing: false,
      });
    });
  };

  const handleTodoEdit = (id: string) => {
    const todo = todos.find((todo) => todo.id === id);

    setTempEditingTodo({ id: todo?.id ?? "", title: todo?.title ?? "" });
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => {
      return prev.filter((todo) => todo.id !== id);
    });
  };

  return (
    <>
      <h1>TODOS</h1>
      <input value={newTodo} onChange={handleNewTodoChange} />
      <button onClick={addNewTodo}>Add Todo</button>
      <div>
        {todos.map((todo) => {
          return (
            <div key={todo.id} className="todo">
              <input
                type="checkbox"
                name={todo.title}
                checked={todo.isDone}
                onChange={() => handleTodoCheck(todo.id)}
              />
              {todo.id === tempEditingTodo?.id ? (
                <div>
                  <input
                    value={tempEditingTodo.title}
                    onChange={handleEditingTodoChange}
                  />

                  <button onClick={handleEditingTodoSubmit}>Submit</button>
                </div>
              ) : (
                <div className="todo">
                  <p>{todo.title}</p>
                  <button onClick={() => handleTodoEdit(todo.id)}>Edit</button>
                </div>
              )}
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
