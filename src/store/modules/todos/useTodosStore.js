import { isToday, TODAY, TODO_OUTDATED_DAYS_VALUE , STORE_DEFAULT_OBJECT} from "@/assets/js/consts/constants";
import { defineStore } from "pinia";
import { useIndexedStore } from "@/store/modules/indexed/useIndexedStore";
import { computed, toRaw } from "vue";
// import type { Todos } from "@/store/modules/todos/useTodosStoreTypes.types";

export const useTodosStore = defineStore("todos", () => {
  const { addTaskToDb, deleteTaskFromDb, updateTask, updateSetting } = useIndexedStore();

  const todos = new Map(); // ? reactivity

  const todosList = computed(() => Array.from(todos.values()));

  const addTodosFromNowForTheEndOfMonth = () => {

  }

  const getTodoById = (id) => {
    return todos.get(id)
  }

  const setTodosToStore = (payload) => {
    payload.forEach((item) => todos.set(item.id, item));
  }

  const addTodo = async (todo) => {
    // async, try, catch
    try {
      await addTaskToDb(todo); // proverit
      todos.set(todo.id, todo);
    } catch (e) {
      throw new Error(`Не удалось добавить todo c id ${todo.id}`, e)
    }
  }

  const setTodoDone = (todo) => {
    todo.isDone = true
    todo.done = new Date().toISOString() // нужно ли дата выполнения? ( вроде, нет )

    // increaseDoneCounter
    this.doneToday += 1 // отдельно вынести
    this.doneTotal += 1

    updateTask(toRaw(todo))
    updateSetting({ key: "doneToday", value: this.doneToday }) // const vmesto str
    updateSetting({ key: "doneTotal", value: this.doneTotal })
    this.setOrderForTodos();
  }

  const deleteTodoById = (id) => { // db -> local, test error
    // async, try, catch
    deleteTaskFromDb(id) // test err
    const isDeleted = todos.delete(id);
  }

  const updateTodoById = (payload) => {
    let todo = getTodoById(payload.id);
    if(todo) {
      Object.assign(todo, payload) // ???
    }
    else console.error(`Todo ${payload.id} not found`)
  }

  // перелать на удаление через время ( тоже делал удаление )
  // import { useDate } from "vuetify/framework";
  // разделить на 2 метода
  // в настройки можно добавить ключ удалено последний раз
  // условие для удаления первый или последний день месяца + старше 90 дней
  // отдельный метод для подсчета разницы в днях
  const checkOutdatedTasks = () => {
    const outdatedTodosId = this.getDoneTodos.reduce((accum, item) => {
      const Difference_In_Time = TODAY.getTime() - new Date(item.done).getTime();
      const Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
      if(Difference_In_Days > TODO_OUTDATED_DAYS_VALUE) {
        accum.push(item.id)
      }
      return accum
    }, [])
    if(outdatedTodosId.length) {
      console.log('outdated', outdatedTodosId)
      this.tasks = this.tasks.filter(item => !outdatedTodosId.includes(item.id))
      // Delete outdated tasks silent
      outdatedTodosId.forEach(id => {
        deleteTaskFromDb(id)
      })
    }
  }

  return {
    todosList,
    setTodosToStore,
    addTodo,
    setTodoDone,
    updateTodoById,
    deleteTodoById,
    checkOutdatedTasks
  }
})
