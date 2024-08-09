<!-- TODO: İnputlara update özelliği eklenecek -->
<!-- TODO: Geçmiş işler özelliği eklenecek eğer istenirse geçmiş işleri de görebilecek -->

<script setup lang="ts">
import { ref, computed } from 'vue';

const todoStore = useTodoStore();
const todo = ref<string>('');
const showWarning = ref<boolean>(false);
const warningMessage = ref<string>('');
const editId = ref<string | null>(null);
const editName = ref<string>(''); // Geçici düzenleme değişkeni

const changeDisable = (id: string) => {
  todoStore.todoList.forEach((o) => {
    if (o.id === id) o.disabled = !o.disabled;
  });
};
// Sayfa yüklendiğinde localStorage'dan verileri yükle
const loadFromLocalStorage = () => {
  const savedTodos = JSON.parse(localStorage.getItem('todoList') ?? '');
  console.log('Loaded Todos from LocalStorage:', savedTodos); // Konsola veri yükleme işlemini loglayın
  if (savedTodos) {
    todoStore.todoList = savedTodos;
  }
};
//Sayfa yüklendiğinde loadFromLocalStorage fonksiyonunu çalıştır
onMounted(() => {
  loadFromLocalStorage();
});

// Görev listesini izleyerek her değişiklikte localStorage'a kaydet
watch(
  () => todoStore.todoList,
  (newList) => {
    console.log('Saving to LocalStorage:', newList); // Konsola veri kaydetme işlemini loglayın
    localStorage.setItem('todoList', JSON.stringify(newList));
  },
  { deep: true }
);


const handleSave = () => {
  if (editId.value) {
    if (!editName.value.trim()) {
      warningMessage.value = 'Lütfen güncellemek istediğiniz metni yazınız';
      showWarning.value = true;
      setTimeout(() => {
        showWarning.value = false;
      }, 3000);
    } else if (todoStore.todoList.some((t) => t.name === editName.value.trim() && t.id !== editId.value)) {
      warningMessage.value = 'Bu metin zaten mevcut';
      showWarning.value = true;
      setTimeout(() => {
        showWarning.value = false;
      }, 3000);
    } else {
      todoStore.updateTodo(editId.value, editName.value);
      editId.value = null;
      editName.value = '';
    }
  } else {
    if (!todo.value.trim()) {
      warningMessage.value = 'Lütfen eklemek istediğiniz metni yazınız';
      showWarning.value = true;
      setTimeout(() => {
        showWarning.value = false;
      }, 3000);
    } else if (todoStore.todoList.some((t) => t.name === todo.value.trim())) {
      warningMessage.value = 'Bu metin zaten mevcut';
      showWarning.value = true;
      setTimeout(() => {
        showWarning.value = false;
      }, 3000);
    } else {
      todoStore.setTodo(todo.value);
      todo.value = '';
    }
  }
};

const editTask = (task) => {
  if (!task) {
    console.error('Task is null or undefined:', task);
    return;
  }

  if (!task.id || !task.name) {
    console.error('Task is missing id or name:', task);
    return;
  }

  console.log('Edit Task Called:', task);
  editId.value = task.id;
  editName.value = task.name;
  console.log('editId:', editId.value, 'editName:', editName.value);
};

const pendingTasks = computed(() => {
  return todoStore.todoList.filter((task) => task.disabled);
});
</script>

<template>
  <div class="w-full gap-3 flex flex-column align-items-center justify-content-center">
    <div v-if="todoStore.todoList.length === 0">Yapılacak iş yoktur</div> 
    <div v-else> 
      <div v-for="todo in todoStore.todoList" :key="todo.id"> 
        <br>
        <div
          class="flex cursor-pointer hover:border-blue-400 hover:text-blue-400 align-items-center justify-content-between gap-2 w-30rem border-1 border-round border-gray-400 py-2 px-3">
          <div class="flex gap-2">
            <div :class="`pi ${todo.disabled ? 'pi-circle-fill text-green-400' : 'pi-circle text-red-400'}`" />
            <label v-if="editId !== todo.id"> {{ todo.name }} </label>
            
            <input v-else type="text" v-model="editName" @keyup.enter="handleSave" />
          </div>
          <div>
            <Button @click="changeDisable(todo.id)" link icon="pi pi-check-circle" />
            <Button v-if="editId !== todo.id" @click="editTask(todo)" link icon="pi pi-pencil" />
            <Button v-if="editId === todo.id" @click="handleSave" link icon="pi pi-save" />
            <Button @click="todoStore.removeTodo(todo.id)" link icon="pi pi-times-circle" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-column gap-2 w-20rem">
      <InputText v-model="todo" @keyup.enter="handleSave" />
      <Button label="save" icon="pi pi-save" @click="handleSave" />
      <Button label="clear" icon="pi pi-trash" @click="todoStore.clearTodo" />
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