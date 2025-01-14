import { defineStore } from "pinia";
import { useTodosStore } from "@/store/modules/todos/useTodosStore";

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchStr: '',
  }),
  getters: {
    isSearching(state) {
      return state.searchStr.length > 0
    },
    searchResult(state) {
      if (state.searchStr === '') return []
      const todosStore = useTodosStore()
      return todosStore.tasks.filter(item => item.title.toLowerCase().includes(state.searchStr.toLowerCase()))
    }
  },
  actions: {
    setSearchStr(payload) {
      this.searchStr = payload;
    }
  }
})
