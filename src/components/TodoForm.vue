<script setup lang="ts">
import {
  reactive,
  ref,
  computed,
  useTemplateRef,
  toRaw
} from 'vue';
import { WEEKDAYS, swatches } from '@/constants';
import { useTodosStore } from '@/store/modules';
import { useDate } from 'vuetify/framework';
import { useDateConfigurator } from '@/composables';
import type {
  TodoId,
  TodoForm,
  Todo,
  TodoWithMultipleDates,
  TodoDeferredType
} from '@/types';
import type { VForm } from 'vuetify/components';

interface Props {
  todoId?: TodoId | null;
}

const { todoId = null } = defineProps<Props>();

interface Emits {
  close: [];
}

defineEmits<Emits>();

const todosStore = useTodosStore();
const {
  addTodosFromDateForTheEndOfMonth,
  addTodo,
  getTodoById,
  updateTodoById
} = todosStore;
const {
  getDaysFromCurrentForTheEndOfMonth,
  getEveryNDayForTheEndOfMonth,
  setTimeForDate,
  getHumanizedDate
} = useDateConfigurator();
const { startOfDay, endOfDay, date } = useDate();

const showPicker = ref(false);
const formRef = useTemplateRef<VForm>('formTempRef');
const snackbarSuccess = ref(false);
const snackbarError = ref(false);
const selectedDaysRange = ref<number[]>([]);

const todosType = ref<TodoDeferredType>('single');
const startEventTime = ref<string | null>(null);
const endEventTime = ref<string | null>(null);
// Modals
const showStartTimeDialog = ref(false);
const showEndTimeDialog = ref(false);

let form = reactive<TodoForm | Todo>({
  description: '',
  deferred: null,
  isDone: false,
  done: null,
  created: null,
  name: '',
  start: null,
  end: null,
  color: swatches[0][0],
  timed: false
});

const isCreating = computed(() => todoId === null);
const isUpdating = computed(() => !isCreating.value);
const humanizedDate = computed(() => {
  if (!form.deferred) return '';
  if (Array.isArray(form.deferred)) {
    return form.deferred.length + ' дней';
  }
  return getHumanizedDate(form.deferred);
});

const isSingleDateMode = computed(
  () => todosType.value === 'single'
);
const needToSelectDays = computed(
  () =>
    todosType.value === 'selected' &&
    selectedDaysRange.value.length === 0
);

if (todoId) {
  const targetTodo = getTodoById(todoId);
  if (targetTodo) {
    Object.assign(form, { ...targetTodo });
  }
}

const clearDatePicker = () => {
  showPicker.value = false;
  form.deferred = null;
};

const toggleDatePicker = () => {
  if (!form.deferred) {
    switch (todosType.value) {
      case 'everyday':
        form.deferred = getDaysFromCurrentForTheEndOfMonth(
          date() as Date
        );
        break;
      case 'selected':
        form.deferred = getEveryNDayForTheEndOfMonth(
          date() as Date,
          selectedDaysRange.value
        );
        break;
    }
    showPicker.value = true;
  }
};

const prepareFormDate = <T extends TodoForm | Todo>(
  todoForm: T
): T => {
  let { deferred, timed } = todoForm;
  const created = new Date();

  let targetDate = created;
  if (deferred) {
    targetDate = Array.isArray(deferred)
      ? deferred[0]
      : deferred;
  }

  let start = startOfDay(targetDate) as Date;
  let end = endOfDay(targetDate) as Date;

  if (startEventTime.value) {
    start = setTimeForDate(
      start,
      ...startEventTime.value.split(':').map((el) => +el)
    );
  }

  if (endEventTime.value) {
    end = setTimeForDate(
      end,
      ...endEventTime.value.split(':').map((el) => +el)
    );
  }

  if (startEventTime.value || endEventTime.value) {
    timed = true;
  }

  return {
    ...todoForm,
    created,
    start,
    end,
    timed
  };
};

const submitHandler = async () => {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();

  if (!valid) return;

  type PrepareFormReturn = ReturnType<
    typeof prepareFormDate
  >;
  const payload: PrepareFormReturn = prepareFormDate(
    toRaw(form)
  );

  if (isUpdating.value) {
    try {
      await updateTodoById(payload as Todo);
      snackbarSuccess.value = true;
    } catch (e) {
      snackbarError.value = true;
      console.error(e);
    }
    return;
  }

  if (isSingleDateMode.value) {
    payload.id = crypto.randomUUID();

    try {
      await addTodo(payload as Todo);
      snackbarSuccess.value = true;
      formRef.value.reset();
    } catch (e) {
      snackbarError.value = true;
      console.error(e);
    }
  } else {
    try {
      // Multiple creation
      await addTodosFromDateForTheEndOfMonth(
        payload as TodoWithMultipleDates
      );
      snackbarSuccess.value = true;
      formRef.value.reset();
    } catch (e) {
      snackbarError.value = true;
      console.error(e);
    }
  }
};
</script>

<template>
  <v-card class="pt-3">
    <v-form ref="formTempRef">
      <v-card-text class="py-0">
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="form.name"
              label="Название задачи"
              variant="outlined"
              density="compact"
              :rules="[
                (v) => !!v || 'Заголовок отбязателен'
              ]"
              required
              validate-on="blur lazy"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Описание задачи"
              variant="outlined"
              density="compact"
              rows="2"
              max-rows="5"
              auto-grow
              clearable
              counter
              hide-details
            />
          </v-col>

          <v-radio-group
            v-if="isCreating"
            v-model="todosType"
            label="Запланировать на:"
            color="primary"
            density="compact"
            hide-details
          >
            <v-radio label="один день" value="single" />
            <v-radio label="каждый день" value="everyday" />
            <v-radio
              label="отдельные дни"
              value="selected"
            />
          </v-radio-group>

          <v-col v-if="todosType === 'selected'" cols="12">
            <v-autocomplete
              v-model="selectedDaysRange"
              :items="WEEKDAYS"
              label="Дни"
              multiple
              variant="outlined"
              clearable
              :rules="[
                (v) =>
                  !!v.length ||
                  'Нужно выбрать хоть один день'
              ]"
              required
              validate-on="blur lazy"
            />
          </v-col>

          <v-col cols="12">
            <v-color-picker
              v-model="form.color"
              :swatches="swatches"
              show-swatches
              hide-header
              hide-inputs
              hide-canvas
              hide-eye-dropper
              hide-sliders
            />
          </v-col>

          <v-col cols="12" class="my-2">
            <p v-if="form.deferred" class="mb-2">
              Запланировано на
              {{ humanizedDate }}
            </p>
            <v-btn
              v-if="form.deferred === null"
              :disabled="needToSelectDays"
              variant="outlined"
              text="Запланировать"
              @click="toggleDatePicker"
            />
            <v-btn
              v-else
              variant="outlined"
              text="Отменить"
              @click="form.deferred = null"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              :model-value="startEventTime"
              label="Время начала события"
              variant="outlined"
              density="compact"
              readonly
              hide-details
            >
              <v-dialog
                v-model="showStartTimeDialog"
                activator="parent"
                width="auto"
              >
                <v-time-picker
                  v-model="startEventTime"
                  format="24hr"
                />
              </v-dialog>
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :model-value="endEventTime"
              label="Время окончания события"
              variant="outlined"
              density="compact"
              readonly
              hide-details
            >
              <v-dialog
                v-model="showEndTimeDialog"
                activator="parent"
                width="auto"
              >
                <v-time-picker
                  v-model="endEventTime"
                  format="24hr"
                />
              </v-dialog>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          text="Отмена"
          variant="plain"
          @click="$emit('close')"
        />

        <v-btn
          color="primary"
          text="Сохранить"
          :disabled="!form.deferred"
          variant="tonal"
          @click="submitHandler"
        />
      </v-card-actions>

      <v-dialog v-model="showPicker" max-width="360">
        <v-card max-width="400">
          <v-date-picker
            v-model="form.deferred"
            color="primary"
            header="Выберите дату"
            :title="
              isSingleDateMode
                ? 'Выберите дату'
                : 'Выберите дату начала'
            "
            show-adjacent-months
          />
          <template #actions>
            <v-btn
              :disabled="!form.deferred"
              class="mr-auto"
              text="Назначить"
              @click="showPicker = false"
            />
            <v-btn text="Отмена" @click="clearDatePicker" />
          </template>
        </v-card>
      </v-dialog>
    </v-form>

    <v-snackbar
      v-model="snackbarSuccess"
      :timeout="2000"
      color="success"
      location="top"
    >
      {{
        isCreating ? 'Задача добавлена' : 'Задача обновлена'
      }}
    </v-snackbar>
    <v-snackbar
      v-model="snackbarError"
      :timeout="2000"
      color="error"
      location="top"
    >
      Что-то пошло не так
    </v-snackbar>
  </v-card>
</template>

<style scoped>
.v-color-picker {
  width: auto;
}
</style>
