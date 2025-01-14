<script setup>
import { computed } from "vue";
import { isToday, TABS } from "@/assets/js/consts/constants";
import { useTodosStore } from "@/store/modules/todos/useTodosStore";

const props = defineProps({
  activeTab: { type: String, required: true }
})

const todosStore = useTodosStore();

const calcEfficient = computed(() => {
  const deferredTodayTodos = todosStore.tasks.filter(item => (item.urgent && !item.deferred) || isToday(item.deferred))
  const doneTodayTodosCount = todosStore.doneToday
  const efficientValue = doneTodayTodosCount / (deferredTodayTodos.length || 1)
  return Math.round(efficientValue * 100)
});

const efficientColor = computed(() => {
  if (calcEfficient.value < 33) return 'red';
  if (calcEfficient.value < 66) return 'amber';
  return 'green';
})

const isDoneTab = computed(() => props.activeTab === TABS.DONE)
const showFooter = computed(() => isDoneTab.value ? true : !todosStore.hide_efficient)
const totalTodosCount = computed(() => todosStore.doneTotal) // store.getters["todos/getDoneCount"]
</script>

<template>
  <v-bottom-navigation
    v-if="showFooter"
    class="align-center px-2"
    bg-color="primary"
    :elevation="5"
    grow
    density="compact"
  >
    <span
      v-if="isDoneTab"
      class="text-subtitle-1"
    >
      Выполнено всего <strong>{{ totalTodosCount }}</strong> задач
    </span>
    <v-progress-linear
      v-else
      v-model="calcEfficient"
      :color="efficientColor"
      height="20"
      rounded
    >
      <template v-slot:default="{ value }">
        <strong>Эффективность: {{ Math.ceil(value) }}%</strong>
      </template>
    </v-progress-linear>
  </v-bottom-navigation>
</template>

<style scoped>

</style>
