<script setup lang="ts">
import { AppBar, AppSidebar } from '@/components';
import { ref } from 'vue';

const drawer = ref(false);
</script>

<template>
  <v-layout
    class="fill-height flex-column flex-nowrap bg-blue-grey-darken-1 pa-0 position-relative"
  >
    <slot v-if="$slots.top" name="top" />
    <AppBar v-else @toggle-sidebar="drawer = !drawer" />

    <AppSidebar v-model="drawer" />

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<style scoped></style>
