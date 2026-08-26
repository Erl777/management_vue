<script setup lang="ts">
import {
  ref,
  onMounted,
  useTemplateRef,
  computed,
  Ref
} from 'vue';
import { storeToRefs } from 'pinia';
import {
  useTodosStore,
  useSettingsStore
} from '@/store/modules';
import AppLayout from '@/layouts/AppLayout.vue';
import { TodoDialog, AppFooter } from '@/components';
import type { CalendarTypes, Todo, TodoId } from '@/types';
import type { VCalendar } from 'vuetify/components';
import type { CalendarEvent } from 'vuetify/lib/components/VCalendar/types';
import type { ModalInstance } from '@/components';

definePage({ name: 'index' });

const todosStore = useTodosStore();
const { todosList } = storeToRefs(todosStore);
const { settings } = storeToRefs(useSettingsStore());
const { deleteTodoById, setTodoDoneById } = todosStore;

const calendar = useTemplateRef<VCalendar>('calendarRef');
const editModal =
  useTemplateRef<ModalInstance>('editModalRef');
const focus = ref('');
const type: Ref<CalendarTypes> = ref('month');

const selectedEvent = ref<Todo>();
const selectedElement = ref<Element>();
const selectedOpen = ref(false);
const snackbarError = ref(false);

const showFooter = computed(
  () => !settings.value.hide_efficient
);

onMounted(() => {
  if (calendar.value) {
    calendar.value.checkChange();
  }
});

const viewDay = (
  nativeEvent: Event,
  { date }: CalendarEvent
) => {
  focus.value = date;
  type.value = 'day';
};

const getEventColor = (event: CalendarEvent) => {
  return event.color;
};

const setToday = () => {
  focus.value = '';
};

const prev = () => {
  if (calendar.value) {
    calendar.value.prev();
  }
};

const next = () => {
  if (calendar.value) {
    calendar.value.next();
  }
};

const showEvent = (
  nativeEvent: Event,
  { event }: CalendarEvent
) => {
  const open = () => {
    selectedEvent.value = event;
    selectedElement.value = nativeEvent.target;
    requestAnimationFrame(() =>
      requestAnimationFrame(
        () => (selectedOpen.value = true)
      )
    );
  };

  if (selectedOpen.value) {
    selectedOpen.value = false;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => open())
    );
  } else {
    open();
  }

  nativeEvent.stopPropagation();
};

const openEditModal = () => {
  editModal.value?.openModal();
  closeMenu();
};

const doneHandler = async (id: TodoId) => {
  try {
    await setTodoDoneById(id);
    closeMenu();
  } catch (e) {
    snackbarError.value = true;
    console.error(e);
  }
};

const deleteHandler = async (id: TodoId) => {
  try {
    await deleteTodoById(id);
    closeMenu();
  } catch (e) {
    snackbarError.value = true;
    console.error(e);
  }
};

const closeMenu = () => {
  selectedOpen.value = false;
};
</script>

<template>
  <AppLayout>
    <v-sheet height="48">
      <v-toolbar
        class="calendar-toolbar"
        density="compact"
        flat
      >
        <v-btn
          color="grey-darken-2"
          size="small"
          variant="text"
          icon
          @click="prev"
        >
          <v-icon size="small"> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn
          color="grey-darken-2"
          size="small"
          variant="text"
          icon
          @click="next"
        >
          <v-icon size="small"> mdi-chevron-right </v-icon>
        </v-btn>
        <v-toolbar-title v-if="calendar">
          {{ calendar.title }}
        </v-toolbar-title>
        <v-btn-toggle
          v-model="type"
          class="mr-2"
          color="primary"
          mandatory
          density="comfortable"
        >
          <v-btn icon="mdi-calendar" value="month" />
          <v-btn icon="mdi-view-week" value="week" />
          <v-btn icon="mdi-view-day" value="day" />
        </v-btn-toggle>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="100%">
      <v-calendar
        ref="calendarRef"
        v-model="focus"
        :event-color="getEventColor"
        :events="todosList"
        :type="type"
        color="primary"
        @click:date="viewDay"
        @click:event="showEvent"
        @click:more="viewDay"
      />
      <v-menu
        v-model="selectedOpen"
        :activator="selectedElement"
        :close-on-content-click="false"
        location="end"
      >
        <v-card
          v-if="selectedEvent"
          color="grey-lighten-4"
          min-width="350px"
          flat
        >
          <v-toolbar :color="selectedEvent.color" dark>
            <v-toolbar-title>
              {{ selectedEvent.name }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text v-if="selectedEvent.description">
            <span>
              {{ selectedEvent.description }}
            </span>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="secondary"
              variant="text"
              @click="doneHandler(selectedEvent.id)"
            >
              Готово
            </v-btn>
            <v-btn
              color="secondary"
              variant="text"
              @click="openEditModal"
            >
              Изменить
            </v-btn>
            <v-btn
              color="secondary"
              variant="text"
              @click="deleteHandler(selectedEvent.id)"
            >
              Удалить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>

    <v-btn
      :class="[
        'ma-3 position-fixed',
        { 'mb-12': type === 'day' && showFooter }
      ]"
      color="grey-darken-2"
      variant="outlined"
      location="bottom start"
      @click="setToday"
    >
      Сегодня
    </v-btn>

    <TodoDialog
      ref="editModalRef"
      :todo-id="selectedEvent?.id"
      :with-button="type === 'month'"
    />

    <template v-if="showFooter">
      <AppFooter
        v-show="type === 'day'"
        :selected-date="focus"
      />
    </template>

    <v-snackbar
      v-model="snackbarError"
      :timeout="2000"
      color="error"
      location="top"
    >
      Что-то пошло не так
    </v-snackbar>
  </AppLayout>
</template>

<style scoped></style>
