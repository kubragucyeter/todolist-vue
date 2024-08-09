import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Todo {
  id: string;
  name: string;
  disabled: boolean;
}

export const useTodoStore = defineStore('todo', () => {
  const todoList = ref<Todo[]>([]);

  const setTodo = (name: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      name,
      disabled: false,
    };
    todoList.value.push(newTodo);
  };

  const updateTodo = (id: string, name: string) => {
    const todo = todoList.value.find((t) => t.id === id);
    if (todo) {
      todo.name = name;
    }
  };

  const removeTodo = (id: string) => {
    todoList.value = todoList.value.filter((t) => t.id !== id);
  };

  const clearTodo = () => {
    todoList.value = [];
  };

  return { todoList, setTodo, updateTodo, removeTodo, clearTodo };
});
