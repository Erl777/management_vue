<template>
  <v-app>
    <template v-if="!isAppLoading">
      <router-view />
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

<script setup lang="ts">
import { localStorageKey } from '@/constants';
import { useInitApp } from '@/composables';

const { initApp, isAppLoading } = useInitApp();

initApp();

// это когда еще не использовался indexedDb
if (
  Object.prototype.hasOwnProperty.call(
    localStorage,
    localStorageKey
  )
) {
  localStorage.removeItem(localStorageKey);
}
</script>
