<script setup>
import AppLayout from "@/layouts/AppLayout.vue";

const rows = 90;
const columns = 52;
const total = rows * columns;

const dateDifferenceInWeeks = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / 604_800_000;

const weeksNum = dateDifferenceInWeeks(
  new Date('1998-04-21'),
  new Date('2024-11-20')
)
</script>

<template>
  <AppLayout>
    <div class="years-table">
      <div v-for="cell in total" :key="cell" :class="['week', { 'checked': cell < weeksNum }]"></div>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
.years-table {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px;
}
.week {
  width: 10px;
  height: 10px;
  border: 1px solid;
  &.checked {
    background-color: black;
  }
}
</style>
