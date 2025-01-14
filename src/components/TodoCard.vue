<template>
  <v-col cols="12" md="4" lg="3" class="card-col pa-0 px-md-1">
    <v-card :class="{ 'd-none': isHidden }">
      <div class="d-flex flex-nowrap align-center">
        <v-card-title :class="['flex-1-1-100 pr-0', { 'short': short_card_titles }]">
          {{ todo.title }}
        </v-card-title>

        <v-menu v-if="!isDone">
          <template v-slot:activator="{ props }">
            <v-btn
              class="ml-auto"
              icon="mdi-dots-vertical"
              variant="text"
              v-bind="props"
            ></v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title @click="$emit('edit', todo.id)">Редактировать</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title @click="hideTodo">Скрыть на сегодня</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title @click="deleteTodo">Удалить</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-divider class="mx-4 mb-1"/>

      <v-card-subtitle :class="{'short': short_card_titles }">
        {{ todo.description }}
      </v-card-subtitle>

      <v-chip-group class="py-0 pl-3">
        <v-chip v-if="isDone" variant="text" class="bg-green-accent-4 text-white">
          <v-icon :class="{ 'mr-1': showChipLabels }" icon="mdi-account"/>
          <span v-if="showChipLabels">Готова</span>
        </v-chip>
        <v-chip v-if="todo.important" variant="text" class="bg-orange-accent-4">
          <v-icon :class="{ 'mr-1': showChipLabels }" icon="mdi-alert-box"/>
          <span v-if="showChipLabels">Важная</span>
        </v-chip>

        <v-chip v-if="showUrgentChip" class="bg-red">
          <v-icon :class="{ 'mr-1': showChipLabels }" icon="mdi-clock"/>
          <span v-if="showChipLabels">Срочная</span>
        </v-chip>
        <v-chip v-if="showDefferedChip">
          <v-icon :class="{ 'mr-1': showChipLabels }" icon="mdi-calendar-today"/>
          <span v-if="showChipLabels">Отложенная</span>
        </v-chip>
      </v-chip-group>

      <v-card-actions class="pl-3" v-if="!isDone">
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
  </v-col>
</template>

<script setup>
import { computed } from "vue";
import { isToday } from "@/assets/js/consts/constants";
import { useTodosStore } from "@/store/modules/todos/useTodosStore";
import { storeToRefs } from "pinia";

const todosStore = useTodosStore();
const { short_card_titles } = storeToRefs(todosStore);
const emit = defineEmits(["edit", "hide", "delete", "done"]);
const props = defineProps({
  todo: { type: Object, required: true },
  hideActions: { type: Boolean, default: false }
})

const setTodoDone = () => {
  const todo = todosStore.getTodoById(props.todo.id)
  todosStore.setTodoDoneById(todo)
  // saveChanges()
  emit('done')
}

const deleteTodo = () => {
  todosStore.deleteTodoById(props.todo.id)

  // saveChanges()
  emit('delete')
}

const hideTodo = () => {
  todosStore.hideTodoForToday(props.todo.id)
  // saveChanges()
  emit('hide')
}

// const saveChanges = () => {
//   todosStore.saveStateToStore();
// }

const showChipLabels = computed(() => !todosStore.hide_labels)

const isDone = computed(() => props.todo.done)
const isHidden = computed(() => props.todo.hidden)

const showUrgentChip = computed(() => (props.todo.urgent && !props.todo.deferred) || (props.todo.deferred && isToday(props.todo.deferred)))
const showDefferedChip = computed(() => props.todo.deferred && !isToday(props.todo.deferred))
</script>

<style scoped>
.card-col:not(:last-child) {
  margin-bottom: 8px;
}
.v-card .v-card-title:not(.short), .v-card .v-card-subtitle:not(.short) {
  line-height: 1.25rem;
  white-space: normal;
}
.v-card-actions {
  min-height: 26px;
}
</style>
