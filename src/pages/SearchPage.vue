<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import {
  useSearchStore,
  useSettingsStore
} from '@/store/modules';
import { storeToRefs } from 'pinia';
import { SearchBar, TodoList } from '@/components';
import { computed } from 'vue';

definePage({ name: 'search', path: '/search' });

const { searchResult, searchStr } = storeToRefs(
  useSearchStore()
);
const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

const totalTodosCount = computed(
  () => settings.value.doneTotal
);
</script>

<template>
  <AppLayout>
    <template #top>
      <SearchBar />
    </template>
    <TodoList :todos="searchResult">
      <template #empty>
        <span
          v-if="searchStr"
          class="d-block text-subtitle-1 text-white text-center mt-5"
        >
          Поиск не дал результатов
        </span>
        <span
          v-else
          class="d-block text-subtitle-1 text-white text-center mt-5"
        >
          Здесь будут отображаться результаты поиска
        </span>
      </template>
    </TodoList>
    <v-bottom-navigation
      class="align-center px-2"
      bg-color="primary"
      :elevation="5"
      grow
      density="compact"
    >
      <span class="text-subtitle-1">
        Выполнено за всё время
        <strong>{{ totalTodosCount }}</strong> задач
      </span>
    </v-bottom-navigation>
  </AppLayout>
</template>

<style scoped></style>
