<script setup lang="ts">
import { ref } from 'vue';
import { TodoForm } from '@/components';
import type {
  ModalInstance,
  ModalProps,
} from '@/components';

const { todoId = null, withButton = false } = defineProps<ModalProps>();

const isOpen = ref(false);

const openModal = () => {
  isOpen.value = true;
};

defineExpose<ModalInstance>({
  openModal,
});
</script>

<template>
  <v-dialog v-model="isOpen" max-width="600">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-if="withButton"
        :class="[
          'text-none font-weight-regular position-fixed mr-3 mb-3',
        ]"
        icon="mdi-plus"
        variant="elevated"
        location="bottom end"
        color="yellow"
        v-bind="activatorProps"
      />
    </template>

    <TodoForm :todo-id="todoId" @close="isOpen = false" />
  </v-dialog>
</template>

<style scoped></style>
