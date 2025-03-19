<script setup>
import { computed, ref, watch } from "vue";
import { useTodosStore } from "@/store/modules/todos/useTodosStore";
import { useSearchStore } from "@/store/modules/search/useSearchStore";
import InfoDialog from "@/components/InfoDialog.vue";

defineEmits(['toggleSidebar'])

const activeTab = defineModel('activeTab')

const todosStore = useTodosStore();
const searchStore = useSearchStore();
const searchStr = ref('')

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

      <InfoDialog />
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
