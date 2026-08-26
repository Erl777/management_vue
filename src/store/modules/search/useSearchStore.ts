import { defineStore, storeToRefs } from 'pinia';
import { useTodosStore } from '@/store/modules';
import { computed, ref } from 'vue';

export const useSearchStore = defineStore(
  'searchStore',
  () => {
    const { todosList } = storeToRefs(useTodosStore());

    const searchStr = ref<string>('');

    const searchResult = computed(() => {
      if (searchStr.value === '') return [];
      return todosList.value.filter((item) =>
        item.name
          .toLowerCase()
          .includes(searchStr.value.toLowerCase())
      );
    });

    return {
      searchStr,
      searchResult
    };
  }
);
