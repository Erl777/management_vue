import { isToday, TASK_PRIORITY, TODAY, TODO_OUTDATED_DAYS_VALUE } from "@/assets/js/consts/constants";
import { getTodoPriority } from "@/assets/js/helpers";
import { defineStore } from "pinia";
import { useIndexedStore } from "@/store/modules/todos/useIndexedStore";
import { toRaw } from "vue";

export const useTodosStore = defineStore('todos',{
  state: () => ({
    tasks: [],
    date: null,
    doneToday: 0,
    doneTotal: 0,
    hide_efficient: false,
    hide_labels: false,
    short_card_titles: false,
  }),
  getters: {
    /**
     * Берутся все, кроме готовых
     */
    todosSortedForRender: (state) => {
      return [
        ...state.getImportantAndUrgent.reverse(),
        ...state.getUrgent.reverse(),
        ...state.getImportant.reverse(),
        ...state.getOther.reverse()
      ]
    },

    getTodosCount: (state) => {
      return state.tasks.length
    },

    getDoneCount: (state) => {
      return state.doneTotal
    },

    getDoneTodos: (state) => {
      return state.tasks.filter(item => item.isDone)
    },

    getDoneTodayTodos: (state) => {
      return state.tasks.filter(item => item.isDone && isToday(item.done))
    },

    getDoneToday: (state) => {
      return state.doneToday
    },

    getToday: (state) => {
      return state.tasks.filter(item => getTodoPriority(item) === TASK_PRIORITY.TODAY)
    },

    getImportantAndUrgent: (state) => {
      return state.tasks.filter(item => getTodoPriority(item) === TASK_PRIORITY.IMP_AND_URG)
    },

    getImportant: (state) => {
      return state.tasks.filter(item => getTodoPriority(item) === TASK_PRIORITY.IMPORTANT)
    },

    getUrgent: (state) => {
      return state.tasks.filter(item => getTodoPriority(item) === TASK_PRIORITY.URGENT)
    },

    getOther: (state) => {
      return state.tasks.filter(item => {
        const priority = getTodoPriority(item)
        return priority === TASK_PRIORITY.NORMAL || priority === TASK_PRIORITY.DEFERRED
      })
    },

    getTodoById: (state) => (id) => {
      return state.tasks.find(item => item.id === id)
    }
  },
  actions: {
    setState(payload) {
      Object.keys(payload).forEach(key => {
        this[key] = payload[key];
      })
    },

    setTasks(payload) {
      this.tasks = payload;
    },
    /**
     * Обновляются все, кроме готовых
    */
    setOrderForTodos() {
      this.todosSortedForRender.forEach((item, i) => item.order = i)
      const indexedStore = useIndexedStore();
      indexedStore.updateOrdersInDb(this.todosSortedForRender.map(item => toRaw(item)))
      // console.log(changedItems, changedItems.length)
      // const indexedStore = useIndexedStore();
      // indexedStore.updateOrdersInDb(changedItems)
    },

    setOrdersForSwap() {
      return this.todosSortedForRender.reduce((accum, item, i) => {
        if (!item.order || item.order !== i) {
          item.order = i
          accum.push(toRaw(item));
        }
        return accum;
      }, [])
    },

    updateSettingByKey({ key, value }) {
      this[key] = value;
      const indexedStore = useIndexedStore();
      indexedStore.updateSetting({ key, value })
    },

    checkRepeatedTodos() {
      this.tasks.filter(item => item.repeated).forEach(item => {
        if(item.isDone && !isToday(item.done)) {
          item.isDone = false
          item.done = null
        }
        item.deferred = TODAY.toISOString()
        item.urgent = true
      })
    },

    checkHiddenTodos() {
      this.tasks.filter(item => item.hidden).forEach(item => {
        if(!isToday(item.hidden)) {
          item.hidden = null
        }
      })
    },

    checkOutdatedTasks() {
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
        // this.saveStateToStore()
      }
    },

    resetDayDoneCounter() {
      console.log("RESET !!!");
      this.date = TODAY.toDateString()
      this.doneToday = 0
      const indexedStore = useIndexedStore();
      indexedStore.updateSetting({ key: "date", value: this.date })
      indexedStore.updateSetting({ key: "doneToday", value: 0 })
    },

    addTodo(todo) {
      this.tasks.push(todo)
      // this.setOrderForTodos()
    },

    setTodoDoneById(todo) {
      todo.isDone = true
      todo.done = new Date().toISOString()
      delete todo.order;
      this.doneToday += 1
      this.doneTotal += 1
      const indexedStore = useIndexedStore();
      indexedStore.updateTask(toRaw(todo))
      indexedStore.updateSetting({ key: "doneToday", value: this.doneToday })
      indexedStore.updateSetting({ key: "doneTotal", value: this.doneTotal })
      this.setOrderForTodos();
    },

    deleteTodoById(id) {
      const indexedStore = useIndexedStore();
      indexedStore.deleteTaskFromDb(id)
      this.tasks = this.tasks.filter(item => item.id !== id)
      this.setOrderForTodos()
    },

    hideTodoForToday(id) {
      const todo = this.tasks.find(item => item.id === id)
      if(todo) {
        todo.hidden = new Date().toISOString()
        const indexedStore = useIndexedStore();
        indexedStore.updateTask(toRaw(todo))
      }
    },

    updateTodoById(payload) {
      let todo = this.tasks.find(item => item.id === payload.id)
      if(todo) {
        todo = Object.assign(todo, payload)
        this.setOrderForTodos()
      }
      else console.error(`Todo ${payload.id} not found`)
    },

    changeTodoOrder({ id, order }) {
      const todo = this.tasks.find(item => item.id === id)
      if(todo) {
        todo.order = order
        const indexedStore = useIndexedStore();
        indexedStore.updateTask(toRaw(todo));
      }
      else console.error(`Todo ${id} not found`)
    },

    // getTodosFromLocalStore() {
    //   this.setState(JSON.parse(localStorage.getItem(localStorageKey)))
    // },
    // saveStateToStore() {
    //   localStorage.setItem(localStorageKey, JSON.stringify(this.$state))
    // },
  },
});
