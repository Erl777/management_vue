<script setup>
import { useTodosStore } from "@/store/modules/todos/useTodosStore";
import { computed } from "vue";

const model = defineModel()
const todosStore = useTodosStore();

const settingsList = computed(() => {
  return [
    {
      label: 'Скрывать эффективность',
      storeKey: 'hide_efficient',
      value: todosStore["hide_efficient"],
    },
    {
      label: 'Скрывать текст типов задачи',
      storeKey: 'hide_labels',
      value: todosStore["hide_labels"],
    },
    {
      label: 'Короткие заголовки и описание задач',
      storeKey: 'short_card_titles',
      value: todosStore["short_card_titles"],
    }
  ]
})

const toggleSettingByKey = ({target}, key) => {
  todosStore.updateSettingByKey({ key, value: target.checked })
}
const saveChanges = async () => {
  // await todosStore.saveStateToStore()
}
// v-navigation-drawer :location="$vuetify.display.mobile ? 'bottom' : undefined"
</script>

<template>
  <v-navigation-drawer
    v-model="model"
    location="left"
    temporary
    @update:modelValue="saveChanges"
  >
    <v-list>
      <v-list-item
        v-for="item in settingsList"
        :key="item.storeKey"
        class="px-2"
      >
        <v-checkbox
          :label="item.label"
          :model-value="item.value"
          hide-details
          @change="toggleSettingByKey($event, item.storeKey)"
        ></v-checkbox>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>
