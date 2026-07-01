import { useTodosStore } from "@/store/modules/todos/useTodosStore";
import { useIndexedStore } from "@/store/modules/indexed/useIndexedStore";
import { ref } from "vue";
import { isToday } from "@/assets/js/consts/constants";
import { useSettingsStore } from "@/store/modules/settings/useSettingsStore";
import { storeToRefs } from "pinia";

export function useInitApp () {
  const { setTodosToStore } = useTodosStore();
  const settingsStore = useSettingsStore();
  const { settings } = storeToRefs(settingsStore);
  const { setSettings } = settingsStore;
  const { initDB, getSettingsFromDb, getAllTodosFromDb } = useIndexedStore();
  const isAppLoading = ref(true);

  // const loadDB = () => {
  //
  // }

  const loadTasks = (todos) => {
    if (todos.length) {
      // todosStore.checkOutdatedTasks() // удаление сильно старых
    }
    if(!isToday(settings.value.date)) {
      // resetDayDoneCounter() // возможно уже не понадобится
    }
  }

  const initApp = async () => {
    await initDB();
    // separate
    const settings = await getSettingsFromDb();
    setSettings(settings);

    try {
      const todos = await getAllTodosFromDb();
      console.log("TODOS", todos);
      setTodosToStore(todos);
      loadTasks(todos);
    } catch (e) {
      console.error("Не удалось добавить задачи", e);
    }

    isAppLoading.value = false;
  }

  // Show info dialog fix
  // обратная совместимость данных
  // удалить драгбл библиотеку
  // отдельная стора для настроек
  // страница настроек
  // страница всех с поиском и дебаунсом
  // сделать, чтобы можно было создавать задачу каждый пн или вт, чт, суб
  // эффективность каждый день подсчет + вывод на месячный календарь
  // pattern Наблюдатель ?
  // стркуктура проекта ?
  // документирование ?
  // анализ размера бандла до и после удаления библиотеки

  return { initApp, isAppLoading }
}
