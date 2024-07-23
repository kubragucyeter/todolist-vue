<script setup lang="ts">

const todoStore = useTodoStore()
const todo = ref<string>('');
const showWarning = ref<boolean>(false); // Uyarı mesajını göstermek için ref
const warningMessage = ref<string>(''); // Uyarı mesajı içeriği için ref



const changeDisable = (id: string) => {
  todoStore.todoList.forEach((o => {
    if (o.id === id)
      o.disabled = !o.disabled;

  }))
};

const handleSave = () => {
  if (!todo.value.trim()) {
    warningMessage.value = 'Lütfen eklemek istediğiniz metni yazınız';
    showWarning.value = true;
    setTimeout(() => {
      showWarning.value = false;
    }, 3000); // 3 saniye sonra uyarıyı gizle
  } else if (todoStore.todoList.some(t => t.name === todo.value.trim())) {
    warningMessage.value = 'Bu metin zaten mevcut';
    showWarning.value = true;
    setTimeout(() => {
      showWarning.value = false;
    }, 3000); // 3 saniye sonra uyarıyı gizle
  } else {
    todoStore.setTodo(todo.value);
    todo.value = '';
  }
};

const pendingTasks = computed(() => {
  return todoStore.todoList.filter((task) => task.disabled);
});


</script>

<template>
  <div class="w-full gap-3 flex flex-column align-items-center  justify-content-center">

    <div v-for="todo in todoStore.todoList" :key="todo.id">
      <div @click="() => {
        todoStore.todo = todoStore.todoList.find(o => o.id === todo.id)
      }"
        class="flex cursor-pointer hover:border-blue-400 hover:text-blue-400 align-items-center justify-content-between gap-2 w-30rem border-1 border-round border-gray-400 py-2 px-3 ">
        <div class="flex gap-2">
          <div :class="`pi ${todo.disabled ? 'pi-circle-fill text-green-400' : 'pi-circle text-red-400'}`" />
          <label> {{ todo.name }} </label>
        </div>
        <div>
          <Button @click="changeDisable(todo.id)" link icon="pi pi-check-circle" />
          <Button @click="todoStore.removeTodo(todo.id)" link icon="pi pi-times-circle" />
        </div>




      </div>
    </div>
    <div class="flex flex-column gap-2 w-20rem">
      <div v-if="pendingTasks.length === 0">
        yapılacak iş yoktur.
      </div>
      <div v-else>
        <div> {{ pendingTasks.length }} tane iş yapılacak.</div v-if="">
      </div>
      <InputText v-model="todo" @keyup.enter="handleSave" />
      <Button label="save" icon="pi pi-save" @click="handleSave" />
      <Button label="clear" icon="pi pi-trash " @click="todoStore.clearTodo" />
    </div>

    <div>
      <Message v-if="showWarning" severity="warn">{{ warningMessage }}</Message>

    </div>
  </div>


</template>

<route lang="yaml">
  name: projects
  path: /projects
  meta:
  layout: default
</route>