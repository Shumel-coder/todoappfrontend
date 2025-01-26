import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";
import "./App.css";

interface Todo {
  id: number;
  task: string;
  completed: boolean;
  user: {
    id: number;
    username: string;
  };
}

interface User {
  id: number;
  username: string;
  password: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");

  const API_BASE =
    "https://boiling-thicket-60899-05bdfce02845.herokuapp.com/api/todos";

  // Fetch Todos
  useEffect(() => {
    fetchTodos();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter, user]);

  const fetchTodos = async () => {
    if (!user) return;
    try {
      console.log(`Fetching todos for user ${user.id}`);
      const response = await axios.get<Todo[]>(`${API_BASE}/user/${user.id}`);
      console.log("Fetched todos:", response.data);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  const addTodo = async () => {
    if (!task.trim() || !user) {
      console.error("Task or user is missing");
      return;
    }

    console.log("Add todo payload:", {
      task: task.trim(),
      completed: false,
      user: {
        id: user.id,
        username: user.username,
      },
    });

    try {
      const response = await axios.post<Todo>(
        "https://boiling-thicket-60899-05bdfce02845.herokuapp.com/api/todos/",
        {
          task: task.trim(),
          completed: false,
          user: {
            id: user.id,
            username: user.username,
          },
        }
      );

      console.log("Added todo:", response.data);
      setTodos((prev) => [...prev, response.data]);
      setTask("");
    } catch (error: any) {
      console.error("Add todo error:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  // Update Todo
  const updateTodo = async (id: number, updatedTodo: Partial<Todo>) => {
    try {
      const todoToUpdate = todos.find((t) => t.id === id);
      if (!todoToUpdate) return;

      const response = await axios.put<Todo>(`${API_BASE}/${id}`, {
        ...todoToUpdate,
        ...updatedTodo,
        user: { id: user?.id },
      });

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? response.data : todo))
      );
    } catch (error) {
      console.error("Error updating todo", error);
    }
  };

  // Delete Todo
  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };

  // If not logged in, show login component
  if (!user) {
    return <Login onLogin={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="app-container">
      <h1>Todo App</h1>
      <p>Welcome, {user.username}</p>
      <button onClick={() => setUser(null)}>Logout</button>

      <div className="add-todo-container">
        <input
          type="text"
          placeholder="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <select
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>

      <div>
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <h3
              className={`todo-item-text ${todo.completed ? "completed" : ""}`}
            >
              {todo.task}
            </h3>
            <div className="todo-buttons">
              <button
                className={`complete-btn ${todo.completed ? "completed" : ""}`}
                onClick={() =>
                  updateTodo(todo.id, { completed: !todo.completed })
                }
              >
                {todo.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
