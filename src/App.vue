<template>
  <v-app>
    <template v-if="!isAppLoading">
      <AppBar
        v-model:active-tab="activeTab"
        @toggle-sidebar="drawer = !drawer"
      />

      <AppSidebar
        v-model="drawer"
      />

      <v-main>
        <HomePage v-if="false" :mode="activeTab" />
        <Calendar />
      </v-main>

      <AppFooter v-if="false" :active-tab="activeTab" />
    </template>
    <v-overlay
      :model-value="isAppLoading"
      class="align-center justify-center"
      :opacity="0.8"
    >
      <v-progress-circular
        color="orange"
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { TABS, localStorageKey } from "@/assets/js/consts/constants";
import AppBar from "@/components/AppBar.vue";
import HomePage from "@/pages/HomePage.vue";
import AppSidebar from "@/components/AppSidebar.vue";
import AppFooter from "@/components/AppFooter.vue";
import { useInitApp } from "@/composables/InitApp";
import { Calendar } from "@/pages";

/*
*   <v-main>
      <router-view />
    </v-main>
* */


/* -------------------- */
const { initApp, isAppLoading } = useInitApp();

const drawer = ref(false);
const activeTab = ref(TABS.IN_WORK);

initApp();

// это когда еще не использовался indexedDb
if(Object.prototype.hasOwnProperty.call(localStorage, localStorageKey)) {
  console.log("Clear local store")
  localStorage.removeItem(localStorageKey)
}

</script>
