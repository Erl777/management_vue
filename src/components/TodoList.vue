<template>
  <template v-if="todos.length">
    <draggable
      :model-value="todos"
      item-key="id"
      handle=".v-card-title"
      class="pa-2 d-md-flex flex-md-wrap"
      :disabled="dragDisabled"
      @end="swapCardIndexes"
    >
      <template #item="{element}">
        <todo-card
          :todo="element"
          @edit="openEditModal"
          @done="showSnackbar('Перемещена в готовые')"
          @delete="showSnackbar('Удалена')"
          @hide="showSnackbar('Скрыта')"
        />
      </template>
    </draggable>
  </template>
  <slot v-else name="empty"/>

  <v-dialog v-model="isEditModalOpen" max-width="600">
    <TaskForm
      :todo-id="todoId"
      @close="isEditModalOpen = false"
    />
  </v-dialog>
  <v-snackbar
    v-model="isSnackbarOpen"
    :timeout="2000"
    color="success"
  >
    {{ snackbarContent }}
  </v-snackbar>
</template>

<script setup>
import draggable from 'vuedraggable'
import TodoCard from "@/components/TodoCard.vue";
import { ref } from "vue";
import TaskForm from "@/components/TaskForm.vue";
import { useTodosStore } from "@/store/modules/todos/useTodosStore";

const props = defineProps({
  todos: {type: Array, required: true},
  dragDisabled: { type: Boolean, default: false }
});

const todosStore = useTodosStore();

const isEditModalOpen = ref(false),
  todoId = ref(null),
  snackbarContent = ref('Успех'),
  isSnackbarOpen = ref(false);

const openEditModal = (id) => {
  isEditModalOpen.value = true
  todoId.value = id;
}

const showSnackbar = (contentStr) => {
  isSnackbarOpen.value = true;
  snackbarContent.value = contentStr
}

const swapCardIndexes = ({ oldIndex, newIndex }) => {
  const startTodo = props.todos[newIndex]
  const endTodo = props.todos[oldIndex]
  if ( startTodo && endTodo ) {
    todosStore.changeTodoOrder({ id: startTodo.id, order: oldIndex })
    todosStore.changeTodoOrder({ id: endTodo.id, order: newIndex })
    // todosStore.saveStateToStore()
  }
}
</script>

<style scoped>

</style>
