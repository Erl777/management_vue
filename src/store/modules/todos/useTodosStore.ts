import { TODAY } from '@/constants';
import { defineStore } from 'pinia';
import {
  useIndexedStore,
  useSettingsStore,
} from '@/store/modules';
import { computed, ComputedRef, ref, toRaw } from 'vue';
import { useDateConfigurator } from '@/composables';
import type {
  Todos,
  Todo,
  TodoWithMultipleDates,
  TodoId,
} from '@/types';

export const useTodosStore = defineStore(
  'todosStore',
  () => {
    const {
      deleteTaskFromDB,
      updateTaskInDB,
      addTaskToDB,
    } = useIndexedStore();
    const { getDatesTimeObjects, getThreeMonthsAgoDate } =
      useDateConfigurator();
    const { increaseDoneCounter } = useSettingsStore();

    const todos = ref<Record<TodoId, Todo>>({});

    const todosList: ComputedRef<Todos> = computed(() =>
      Object.values(todos.value),
    );

    function createRepeatedTodo({
      description,
      name,
      color,
      deferred,
      start,
      end,
      timed,
      created,
    }: Todo) {
      return {
        id: crypto.randomUUID(),
        description,
        isDone: false,
        done: null,
        repeated: true,
        created,
        deferred,
        name,
        start,
        end,
        color,
        timed,
      };
    }

    const addTodosFromDateForTheEndOfMonth = async (
      todo: TodoWithMultipleDates,
    ) => {
      const datesArr = getDatesTimeObjects(todo);
      const todosArr = datesArr.map((item) =>
        createRepeatedTodo(
          Object.assign({ ...todo }, item),
        ),
      );

      const promises = todosArr.map((item) =>
        addTodo(item),
      );

      const result = await Promise.allSettled(promises);
      const hasRejected = result.some(
        (item) => item.status === 'rejected',
      );

      if (hasRejected) {
        const failedItems = result.filter(
          (item) => item.status === 'rejected',
        );
        throw new Error(
          `Не удалось добавить ${failedItems.length} задач группой`,
        );
      }
    };

    const getTodoById = (id: TodoId) => {
      return todos.value[id];
    };

    const setTodosToStore = (payload: Todos) => {
      payload.forEach(
        (item) => (todos.value[item.id] = item),
      );
    };

    const addTodo = async (todo: Todo) => {
      try {
        await addTaskToDB(todo);
        todos.value[todo.id] = todo;
      } catch (e) {
        console.error(e);
        throw new Error(
          `Не удалось добавить todo c id ${todo.id}`,
        );
      }
    };

    const setTodoDoneById = async (id: TodoId) => {
      const todo = getTodoById(id);
      if (todo) {
        todo.isDone = true;
        todo.done = new Date();
        todo.color = 'green';

        try {
          await updateTaskInDB(toRaw(todo));
          increaseDoneCounter();
        } catch (e) {
          console.error(e);
          throw new Error(
            'Не удалось изменить статус задачи',
          );
        }
      } else {
        throw new Error(`Нет задачи с id ${id}`);
      }
    };

    const deleteTodoById = async (id: TodoId) => {
      try {
        await deleteTaskFromDB(id);
        if (todos.value[id]) {
          delete todos.value[id];
        }
      } catch (e) {
        console.error(e);
        throw new Error(
          `Не удалось удалить элемент с id ${id}`,
        );
      }
    };

    const updateTodoById = async (payload: Todo) => {
      try {
        const todo = getTodoById(payload.id);
        if (todo) {
          await updateTaskInDB(payload);
          Object.assign(todo, payload);
        } else {
          console.error(`Todo ${payload.id} not found`);
        }
      } catch (e) {
        console.error(e);
        throw new Error('Не удалось обновить задачу');
      }
    };

    const getTodosDeferredOnDate = (
      date: string,
    ): Todos => {
      return todosList.value.filter(
        (item) =>
          item.deferred &&
          item.deferred.toDateString() ===
            new Date(date).toDateString(),
      );
    };

    const getOutdatedTodosId = () => {
      return todosList.value.reduce((accum, item) => {
        const lastAppliedDate =
          getThreeMonthsAgoDate(TODAY);

        if (
          item.created.getTime() < lastAppliedDate.getTime()
        ) {
          accum.push(item.id);
        }
        return accum;
      }, [] as TodoId[]);
    };

    const checkOutdatedTasks = async () => {
      const outdatedTodosId = getOutdatedTodosId();

      if (outdatedTodosId.length) {
        const promises = outdatedTodosId.map((id) =>
          deleteTodoById(id),
        );
        const result = await Promise.allSettled(promises);
        const hasRejected = result.some(
          (item) => item.status === 'rejected',
        );

        if (hasRejected) {
          const failedItems = result.filter(
            (item) => item.status === 'rejected',
          );
          throw new Error(
            `Не удалось удалить ${failedItems.length} задач группой`,
          );
        }
      }
    };

    return {
      todosList,
      setTodosToStore,
      addTodo,
      getTodoById,
      setTodoDoneById,
      updateTodoById,
      deleteTodoById,
      checkOutdatedTasks,
      addTodosFromDateForTheEndOfMonth,
      getTodosDeferredOnDate,
    };
  },
);
