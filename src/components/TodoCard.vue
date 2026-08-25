<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  useTodosStore,
  useSettingsStore,
} from '@/store/modules';
import { storeToRefs } from 'pinia';
import type { Todo, TodoId } from '@/types';

const todosStore = useTodosStore();
const { settings } = storeToRefs(useSettingsStore());
const { setTodoDoneById, deleteTodoById } = todosStore;

interface Emits {
  edit: [value: TodoId];
  delete: [];
  done: [];
}

const emit = defineEmits<Emits>();

interface Props {
  todo: Todo;
}

const { todo } = defineProps<Props>();

const snackbarError = ref(false);
const shortLabels = computed(
  () => settings.value.short_card_titles,
);
const isDone = computed(() => todo.isDone);

const setTodoDone = async () => {
  try {
    await setTodoDoneById(todo.id);
    emit('done');
  } catch (e) {
    snackbarError.value = true;
    console.error(e);
  }
};

const deleteTodo = async () => {
  try {
    await deleteTodoById(todo.id);
    emit('delete');
  } catch (e) {
    snackbarError.value = true;
    console.error(e);
  }
};
</script>

<template>
  <v-col
    cols="12"
    md="4"
    lg="3"
    class="card-col pa-0 px-md-1"
  >
    <v-card>
      <div class="d-flex flex-nowrap align-center">
        <v-card-title
          :class="[
            'flex-1-1-100 pr-0',
            { short: shortLabels },
          ]"
        >
          <span>{{ todo.name }}</span>
        </v-card-title>

        <v-menu v-if="!isDone">
          <template #activator="{ props }">
            <v-btn
              class="ml-auto"
              icon="mdi-dots-vertical"
              variant="text"
              v-bind="props"
            />
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title
                @click="$emit('edit', todo.id)"
              >
                Редактировать
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title @click="deleteTodo">
                Удалить
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-divider class="mx-4 mb-1" />

      <v-card-subtitle :class="{ short: shortLabels }">
        {{ todo.description }}
      </v-card-subtitle>

      <v-chip-group class="py-0 pl-3">
        <v-chip
          v-if="isDone"
          variant="text"
          class="bg-green-accent-4 text-white"
        >
          <v-icon class="mr-1" icon="mdi-account" />
          <span>Готова</span>
        </v-chip>
      </v-chip-group>

      <v-card-actions
        v-if="!isDone"
        class="d-flex justify-center px-3 pt-1 pb-2"
      >
        <v-btn
          color="primary"
          variant="elevated"
          elevation="3"
          density="compact"
          @click="setTodoDone"
        >
          Готово
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="snackbarError"
      :timeout="2000"
      color="error"
      location="top"
    >
      Что-то пошло не так
    </v-snackbar>
  </v-col>
</template>

<style scoped>
.card-col:not(:last-child) {
  margin-bottom: 8px;
}
.v-card .v-card-title:not(.short),
.v-card .v-card-subtitle:not(.short) {
  line-height: 1.25rem;
  white-space: normal;
}
.v-card-actions {
  min-height: 26px;
}
</style>
