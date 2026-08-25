<script setup lang="ts">
import router from '@/router';

interface Emits {
  toggleSidebar: [];
}

defineEmits<Emits>();
</script>

<template>
  <v-app-bar
    app
    color="primary"
    dark
    :elevation="5"
    density="compact"
  >
    <v-app-bar-nav-icon
      @click.stop="$emit('toggleSidebar')"
    />
    <v-toolbar-title>Планирование</v-toolbar-title>

    <v-btn icon @click="router.push({ name: 'search' })">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<style scoped></style>
