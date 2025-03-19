<script setup>
import { ref } from "vue";
import { TODO_OUTDATED_DAYS_VALUE } from "@/assets/js/consts/constants";
import { useTodosStore } from "@/store/modules/todos/useTodosStore";
import { storeToRefs } from "pinia";

const todosStore = useTodosStore();
const { show_info_dialog } = storeToRefs(todosStore);
const dialog = ref(show_info_dialog.value);

const close = () => {
  dialog.value = false;
  if (show_info_dialog.value) todosStore.updateSettingByKey({ key: "show_info_dialog", value: false })
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        icon="mdi-information-outline"
        v-bind="activatorProps"
      ></v-btn>
    </template>
    <v-card prepend-icon="mdi-information-outline" title="Справка">
      <v-card-text>
        <p class="mb-1">Приложение разработано на основе матрицы Эйзенхауэра.</p>
        <p>Суть метода - в разделении задач на категории:</p>
        <ul class="pl-5 mb-4">
          <li>Важные и Срочные</li>
          <li>Срочные</li>
          <li>Важные</li>
          <li>Остальные</li>
        </ul>
        <p><strong>Важные и Срочные -</strong> нужно делать в первую очередь.</p>
        <p><strong>Важные -</strong> позволяют двигаться к поставленным целям. Зачастую не "привязаны" к конкретному времени.</p>
        <p><strong>Срочные -</strong> часто "привязанны" к конкретному времени или дню недели. Их, по возможности, нужно кому-то делегировать.</p>
        <p class="mb-2"><strong>Остальные -</strong> делаются когда выполены задачи с типами Важные или Срочные или пока не станут более важными или срочными. </p>
        <p class="mb-2">Не актуальные задачи можно удалять.</p>
        <p class="mb-2">Присутствует рассчет личной эффективности ( процент = все задачи/срочные ). <br>Он был добавлен для создания мотивации.</p>
        <p>Задачи можно запланировать и они станут Срочными в выбраную вами дату.</p>
        <p class="mb-2">Задачи можно менять местами перетаскивая за иконку <v-icon icon="mdi-drag"/> перед заголовком задачи.</p>
        <p class="mb-2">Готовые задачи хранятся в памяти приложения {{ TODO_OUTDATED_DAYS_VALUE }} дней. Их можно найти воспользовавшить поиском на вкладке Готовые.</p>
        <p>Надеюсь, что моё приложение сможет помочь вам обрести навык планирования, если у вас его еще нет, сформировать новые полезные привычки и,
          просто, станет полезным помошником.</p>
      </v-card-text>
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          text="Ok"
          @click="close"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
