<script setup>
import AppLayout from "@/layouts/AppLayout.vue";
import TaskForm from "@/components/TaskForm.vue";
import TodoList from "@/components/TodoList.vue";
import { ref, computed } from "vue"
import { TABS } from "@/assets/js/consts/constants";
import { useTodosStore } from "@/store/modules/todos/useTodosStore";
import { useSearchStore } from "@/store/modules/search/useSearchStore";
import { storeToRefs } from "pinia";

defineProps({
  mode: { type: String, required: true }
})

const todosStore = useTodosStore();
const searchStore = useSearchStore();
const { hide_efficient } = storeToRefs(todosStore);
const dialog = ref(false);

// const todos = computed(() => store.getters["todos/todosSortedForRender"])
const todos = computed(() => [...todosStore.todosSortedForRender].sort((a, b) => a.order - b.order))

// const todosByTab = computed(() => props.mode === TABS.IN_WORK ? todos.value : todosStore.getDoneTodos) // store.getters["todos/getDoneTodos"]
const todosDoneToday = computed(() => todosStore.getDoneTodayTodos)
// const emptyListStr = computed(() => props.mode === TABS.IN_WORK ? 'У вас нет задач для выполнения' : 'Нет выполненых задач за сегодня')
const todosBySearch = computed(() => searchStore.searchResult) // store.getters["search/searchResult"]
const isSearching = computed(() => searchStore.isSearching) // store.getters["search/isSearching"]
// const sortedTodos = computed(() => isSearching.value ? todosBySearch.value : todosByTab.value)
const addBtnBottomClass = computed(() => hide_efficient.value ? 'mb-2' : 'mb-12')
</script>

<template>
  <AppLayout>
    <TodoList
      v-if="mode === TABS.IN_WORK && !isSearching"
      :todos="todos"
    >
      <template #empty>
        <span
          class="d-block text-subtitle-1 text-white text-center mt-5"
        >
          У вас нет задач для выполнения
        </span>
      </template>
    </TodoList>
    <TodoList
      v-if="mode === TABS.DONE && !isSearching"
      :todos="todosDoneToday"
      drag-disabled
    >
      <template #empty>
        <span
          class="d-block text-subtitle-1 text-white text-center mt-5"
        >
          Нет выполненых задач за сегодня
        </span>
      </template>
    </TodoList>
    <TodoList
      v-if="isSearching"
      :todos="todosBySearch"
      drag-disabled
    >
      <template #empty>
        <span
          class="d-block text-subtitle-1 text-white text-center mt-5"
        >
          Поиск не дал результатов
        </span>
      </template>
    </TodoList>

    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          v-show="mode === TABS.IN_WORK && !isSearching"
          :class="['text-none font-weight-regular position-fixed mr-2', addBtnBottomClass]"
          icon="mdi-plus"
          variant="elevated"
          location="bottom end"
          color="yellow"
          v-bind="activatorProps"
        ></v-btn>
      </template>

      <TaskForm
        @close="dialog = false"
      />

    </v-dialog>
  </AppLayout>
</template>

<style scoped>

</style>
