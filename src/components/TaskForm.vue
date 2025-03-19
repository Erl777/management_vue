<template>
  <v-card prepend-icon="mdi-account" title="Создание задачи">
    <v-form ref="formRef">
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="form.title"
              label="Название задачи"
              variant="outlined"
              :rules="[v => !!v || 'Заголовок отбязателен']"
              required
              autofocus
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Описание задачи"
              variant="outlined"
              clearable
              no-resize
              counter
            />
          </v-col>

          <v-col v-if="false" cols="12">
            <v-autocomplete
              :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
              label="Interests"
              auto-select-first
              multiple
            ></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-checkbox
              v-model="form.urgent"
              color="red"
              label="Срочная"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox
              v-model="form.important"
              color="orange"
              label="Важная"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox
              v-model="form.repeated"
              label="Ежедневная"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12">
            <p
              v-if="form.deferred && !form.repeated"
              class="mb-2"
            >
              Запланировано на {{ humanizedDate }}
            </p>
            <v-btn
              v-if="!form.repeated"
              variant="outlined"
              :text="form.deferred === null ? 'Запланировать' : 'Отменить'"
              @click="deferrHandler"
            ></v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Отмена"
          variant="plain"
          @click="$emit('close')"
        ></v-btn>

        <v-btn
          color="primary"
          text="Сохранить"
          variant="tonal"
          @click="validate"
        ></v-btn>
      </v-card-actions>

      <v-dialog v-model="showPicker" max-width="360">
        <v-card max-width="400">
          <v-date-picker
            v-model="form.deferred"
            color="primary"
            header="Выберите дату"
            title="Выбор даты"
          ></v-date-picker>
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              :text="form.deferred ? 'Назначить' : 'Отмена'"
              @click="showPicker = false"
            ></v-btn>
          </template>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="snackbarSuccess"
        :timeout="2000"
        color="success"
      >
        {{ isCreating ? 'Задача добавлена' : 'Задача обновлена' }}
      </v-snackbar>
    </v-form>
  </v-card>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { TODAY } from "@/assets/js/consts/constants";
import { useTodosStore } from "@/store/modules/todos/useTodosStore";
import { useIndexedStore } from "@/store/modules/todos/useIndexedStore";

const props = defineProps({
  todoId: { type: [Number, null], default: null }
})

const todosStore = useTodosStore();
const indexedStore = useIndexedStore();
const showPicker = ref(false);
const formRef = ref(null);
const snackbarSuccess = ref(false)

const isCreating = computed(() => props.todoId === null)
const humanizedDate = computed(() => new Date(form.deferred).toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}))

let formDefault = {
  title: '',
  description: '',
  important: false,
  urgent: false,
  deferred: null,
  isDone: false,
  done: null,
  repeated: false,
};
if (props.todoId) {
  formDefault = todosStore.getTodoById(props.todoId)
}
const form = reactive({...formDefault})

const deferrHandler = () => {
  if(!form.deferred) {
    showPicker.value = true
  } else {
    form.deferred = null
  }
}

const validate = async () => {
  const { valid } = await formRef.value.validate()

  if (valid) {
    const payload = Object.assign({}, form);
    if (payload.repeated) {
      payload.deferred = TODAY.toISOString()
      payload.urgent = true
    }
    if (payload.deferred) {
      payload.urgent = true
    }
    if (isCreating.value) {
      payload.id = new Date().getTime();

      todosStore.addTodo(payload)
      indexedStore.addTaskToDb(payload, successCase, () => console.log("Error collback adding task"));

      // todosStore.addTodo(payload)
    } else {
      todosStore.updateTodoById(payload)

    }
    // todosStore.setOrderForTodos(todosStore.todosSortedForRender)
    // try {
    //   await todosStore.saveStateToStore();
    //   snackbarSuccess.value = true;
    //   formRef.value.reset();
    // } catch (e) {
    //   console.log(e)
    // }
  }
};

const successCase = () => {
  todosStore.setOrderForTodos()
  // indexedStore.updateOrdersInDb(changedItems)
  snackbarSuccess.value = true;
  formRef.value.reset();
}
</script>

<style scoped>

</style>
