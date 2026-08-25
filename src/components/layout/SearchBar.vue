<script setup lang="ts">
import { debounce } from '@/utils';
import { ref, watch } from 'vue';
import { useSearchStore } from '@store/modules';
import { storeToRefs } from 'pinia';

const { searchStr } = storeToRefs(useSearchStore());

const localSearchStr = ref('');

const setSearchValue = debounce(
  (value: string) => (searchStr.value = value),
);

watch(localSearchStr, (value) => {
  setSearchValue(value);
});

const resetSearch = () => {
  localSearchStr.value = '';
};
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
      icon="mdi-arrow-left"
      :to="{ name: 'index' }"
    />
    <v-text-field
      v-model="localSearchStr"
      autofocus
      append-inner-icon="mdi-close"
      density="compact"
      label="Поиск по заголовку"
      variant="solo"
      hide-details
      single-line
      class="mx-2"
      @click:append-inner="resetSearch"
    />
  </v-app-bar>
</template>

<style scoped></style>
