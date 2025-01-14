<script setup>
import { computed, ref, watch } from "vue";
import { useTodosStore } from "@/store/modules/todos/useTodosStore";
import { useSearchStore } from "@/store/modules/search/useSearchStore";

defineEmits(['toggleSidebar'])

const activeTab = defineModel('activeTab')

const todosStore = useTodosStore();
const searchStore = useSearchStore();
const searchStr = ref('')
const dialog = ref(false)

const showSearchField = ref(false);

const doneCount = computed(() => todosStore.doneToday)
watch(searchStr, (newValue) => {
  searchStore.setSearchStr(newValue)
})

const closeSearch = () => {
  showSearchField.value = false
  searchStr.value = '';
}

</script>

<template>
  <v-app-bar
    app
    color="primary"
    dark
    :elevation="5"
    density="compact"
  >
    <template v-if="showSearchField">
      <v-text-field
        autofocus
        v-model="searchStr"
        append-inner-icon="mdi-close"
        density="compact"
        label="Поиск по заголовку"
        variant="solo"
        hide-details
        single-line
        class="mx-2"
        @click:append-inner="closeSearch"
      />
    </template>
    <template v-else>
      <v-app-bar-nav-icon @click.stop="$emit('toggleSidebar')"/>
      <v-toolbar-title>Планирование</v-toolbar-title>

      <v-dialog v-model="dialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            icon="mdi-information-outline"
            v-bind="activatorProps"
          ></v-btn>
        </template>
        <v-card prepend-icon="mdi-information-outline" title="Справка">
          <v-card-text>
            <p class="mb-1">Приложение разработано на основе матрицы Эйзенхауэра.</p>
            <p>Суть в разделении задач на категории:</p>
            <ul class="pl-5 mb-4">
              <li>Важные и Срочные</li>
              <li>Срочные</li>
              <li>Важные</li>
              <li>Остальные</li>
            </ul>
            <p><strong>Важные и Срочные -</strong> нужно делать в первую очередь.</p>
            <p><strong>Важные -</strong> позволяют двигаться к поставленным целям. Зачастую не "привязаны" к конкретному времени.</p>
            <p><strong>Срочные -</strong> часто "привязанны" к конкретному времени. Их, по возможности, нужно кому-то делегировать.</p>
            <p class="mb-2"><strong>Остальные -</strong> делаются когда выполены остальные или пока не станут более важными или срочными. </p>
            <p>Присутствует рассчет личной эффективности ( процент = все задачи/срочные ).</p>
            <p>Задачи можно запланировать и они станут Срочными в выбраную вами дату.</p>
            <p class="mb-2">Задачи можно менять местами перетаскивая за Заголовок.</p>
            <p>Надеюсь, что моё приложение сможет помочь вам обрести навык планирования, если у вас его еще нет, и станет полезным помошником.</p>
          </v-card-text>
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="Ok"
              @click="dialog = false"
            />
          </template>
        </v-card>
      </v-dialog>
      <v-btn icon @click="showSearchField = true">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>

    <template v-if="!showSearchField" v-slot:extension>
      <v-tabs
        v-model="activeTab"
        grow
      >
        <v-tab value="list" text="К выполнению"></v-tab>
        <v-tab value="done" :text="`Готовые | ${doneCount}`"></v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<style scoped>

</style>
