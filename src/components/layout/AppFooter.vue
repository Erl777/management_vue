<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  useSettingsStore,
  useTodosStore,
} from '@/store/modules';
import { storeToRefs } from 'pinia';

interface Props {
  selectedDate: string;
}

const { selectedDate = '' } = defineProps<Props>();

const todosStore = useTodosStore();
const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
const { getTodosDeferredOnDate } = todosStore;
const efficient = ref(0);
const averageDayTodosCount = 4; // среднее кол-во задач

watch(
  () => [selectedDate, settings.value.doneTotal],
  () => {
    if (selectedDate) {
      const todosByDate = getTodosDeferredOnDate(selectedDate);
      if (todosByDate.length) {
        const doneTodosByDate = todosByDate.filter((item) => item.isDone);
        if (doneTodosByDate.length) {
          const denominator = todosByDate.length > averageDayTodosCount ? todosByDate.length : averageDayTodosCount;
          efficient.value = (doneTodosByDate.length / denominator) * 100 || 0;
        } else {
          efficient.value = 0;
        }
      }
    }
  },
);

const efficientColor = computed(() => {
  if (efficient.value < 33) return 'red';
  if (efficient.value < 66) return 'amber';
  return 'green';
});
</script>

<template>
  <v-bottom-navigation
    class="align-center px-2 position-fixed"
    bg-color="primary"
    :elevation="5"
    grow
    density="compact"
    app
  >
    <v-progress-linear
      v-model="efficient"
      :color="efficientColor"
      height="20"
      rounded
    >
      <template #default="{ value }">
        <strong
          >Эффективность: {{ Math.ceil(value) }}%</strong
        >
      </template>
    </v-progress-linear>
  </v-bottom-navigation>
</template>

<style scoped></style>
