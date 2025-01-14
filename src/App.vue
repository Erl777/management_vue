<template>
  <v-app>
    <AppBar
      v-model:active-tab="activeTab"
      @toggle-sidebar="drawer = !drawer"
    />

    <AppSidebar
      v-model="drawer"
    />

    <v-main>
      <HomePage :mode="activeTab" />
    </v-main>

    <AppFooter :active-tab="activeTab" />
    <v-overlay
      :opacity="1"
      :value="isLoading"
      absolute
    >
      <v-progress-circular indeterminate size="64">
        Loading...
      </v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { isToday, TABS, localStorageKey } from "@/assets/js/consts/constants";
import AppBar from "@/components/AppBar.vue";
import HomePage from "@/pages/HomePage.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import AppFooter from "@/components/AppFooter.vue";
import { useTodosStore } from "@/store/modules/todos/useTodosStore";
import { useIndexedStore } from "@/store/modules/todos/useIndexedStore";

/*
*   <v-main>
      <router-view />
    </v-main>
* */


/* -------------------- */
const todosStore = useTodosStore();
const indexedStore = useIndexedStore();
const drawer = ref(false);
const activeTab = ref(TABS.IN_WORK);
const isLoading = ref(false);

const initCallback = () => {
  if (todosStore.tasks.length) {
    todosStore.checkOutdatedTasks()
    todosStore.checkRepeatedTodos()
    todosStore.checkHiddenTodos()
  }
  if(!isToday(todosStore.date)) {
    todosStore.resetDayDoneCounter()
  }
}

indexedStore.init(initCallback);

if(Object.prototype.hasOwnProperty.call(localStorage, localStorageKey)) {
  console.log("Clear local store")
  localStorage.removeItem(localStorageKey)
}
</script>
