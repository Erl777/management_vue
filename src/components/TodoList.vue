<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { Todos, TodoId } from '@/types';
import { TodoDialog, TodoCard } from '@/components';
import type { ModalInstance } from '@/components';

interface Props {
  todos: Todos;
}

defineProps<Props>();

const editModal =
  useTemplateRef<ModalInstance>('editModalRef');

const todoId = ref<TodoId | null>(null);
const snackbarContent = ref('Успех');
const isSnackbarOpen = ref(false);

const openEditModal = (id: TodoId) => {
  todoId.value = id;
  editModal.value?.openModal();
};

const showSnackbar = (contentStr: string) => {
  isSnackbarOpen.value = true;
  snackbarContent.value = contentStr;
};
</script>

<template>
  <template v-if="todos.length">
    <div class="pa-2 d-md-flex flex-md-wrap">
      <todo-card
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @edit="openEditModal"
        @done="showSnackbar('Перемещена в готовые')"
        @delete="showSnackbar('Удалена')"
      />
    </div>
  </template>
  <slot v-else name="empty" />

  <TodoDialog ref="editModalRef" :todo-id="todoId" />
  <v-snackbar
    v-model="isSnackbarOpen"
    :timeout="2000"
    color="success"
    location="top"
  >
    {{ snackbarContent }}
  </v-snackbar>
</template>

<style scoped></style>
