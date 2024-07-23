
interface Todo {
  name: string
  id: string
  disabled: boolean
}

export const useTodoStore = defineStore('Todo Store', () => {
  const todoList = ref<{
    name: string
    id: string
    disabled: boolean

  }[]>(JSON.parse(localStorage.getItem('todoList') || '[]'));

  //   {
  //     name: 'Kediyi Besle',
  //     id: '1a7839b3-16a5-431f-8f19-087fd8838fe4',
  //     disabled: true
  //   },
  //   {
  //     name: 'Ödevini Yap',
  //     id: 'd6dee541-bf54-4d09-b9ef-9e5d683f8848',
  //     disabled: truecv 
  //   }


  const todo = ref<Todo | undefined>(todoList.value[0])

  const setTodo = (todo: string) => {
    if (!todo.trim()) return; // boş todo engelleme
    const newTodo = {
      name: todo,
      id: Math.random().toString(36).substr(2, 9),
      disabled: true
    };

    todoList.value.push(newTodo)
    localStorage.setItem('todoList', JSON.stringify(todoList.value))
  }


  const removeTodo = (id: string) => {
    todoList.value = todoList.value.filter(todo => todo.id !== id)
  };

  const clearTodo = () => {
    todoList.value = [];
    localStorage.setItem('todoList', JSON.stringify(todoList.value));
  };

  watch(todoList, (newTodoList) => {
    localStorage.setItem('todoList', JSON.stringify(newTodoList));
  }, { deep: true });

  return {
    todo,
    todoList,
    setTodo,
    clearTodo,
    removeTodo,

  }
})
