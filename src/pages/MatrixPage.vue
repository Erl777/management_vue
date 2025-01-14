<template>
  <AppLayout>
    <v-container class="fill-height">
      <div class="grid position-relative">
        <div
          v-for="(item, index) in matrix"
          :key="index"
          :class="['grid__item pa-4', item.bgColor]"
          @click="$router.push({ name: '/HomePage' })"
        >
          <span>{{ item.title }}</span>
        </div>
        <v-btn
          class="add-btn"
          icon="$vuetify"
          variant="tonal"
        />
      </div>
    </v-container>
  </AppLayout>
</template>

<script setup>

const matrix = [
  {
    title: 'Важные Срочные',
    bgColor: 'bg-green-lighten-1',
    hint: '',
    route: ''
  },
  {
    title: 'Важные',
    bgColor: 'bg-lime-lighten-1',
    hint: '',
    route: ''
  },
  {
    title: 'Срочные',
    bgColor: 'bg-deep-orange-lighten-1',
    hint: '',
    route: ''
  },
  {
    title: 'Остальные',
    bgColor: 'bg-light-blue-darken-1',
    hint: '',
    route: ''
  },
];

import AppLayout from "@/layouts/AppLayout.vue";
</script>

<style lang="scss" scoped>
.grid {
  width: 100%;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  &__item {
    min-height: 110px;
    &:nth-child(1), &:nth-child(4) {
      border-radius: 40px 0 40px 0;
    }
    &:nth-child(2), &:nth-child(3) {
      border-radius: 0 40px 0 40px;
    }
  }
}
.add-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
