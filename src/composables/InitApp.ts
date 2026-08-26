import {
  useTodosStore,
  useIndexedStore,
  useSettingsStore
} from '@/store/modules';
import { ref } from 'vue';
import { isToday } from '@/utils';

export function useInitApp() {
  const { setTodosToStore, checkOutdatedTasks } =
    useTodosStore();
  const settingsStore = useSettingsStore();
  const { setSettings, resetDayDoneCounter } =
    settingsStore;
  const { initDB, getSettingsFromDb, getAllTodosFromDb } =
    useIndexedStore();
  const isAppLoading = ref(true);

  const loadTodos = async () => {
    const todos = await getAllTodosFromDb();
    setTodosToStore(todos);
    if (todos.length) {
      await checkOutdatedTasks();
    }
  };

  const loadSettings = async () => {
    const settings = await getSettingsFromDb();
    setSettings(settings);
    if (!settings.date || !isToday(settings.date)) {
      await resetDayDoneCounter();
    }
  };

  const initApp = async () => {
    try {
      await initDB();

      await loadSettings();

      await loadTodos();

      isAppLoading.value = false;
    } catch (e) {
      console.error('Ошибка инициализации приложения', e);
    }
  };

  return { initApp, isAppLoading };
}
