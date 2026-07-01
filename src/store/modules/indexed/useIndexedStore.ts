import { defineStore } from "pinia";
import { indexedDbKey, STORE_DEFAULT_OBJECT } from "@/assets/js/consts/constants";
import type { RightOfAccess, Todo } from "./useTodosStoreTypes.types.ts";
import { promisify } from "@/assets/js/helpers";

const objectStore = {
  TODOS: "todos",
  SETTINGS: "settings"
}

export const useIndexedStore = defineStore('database', () => {
  let db: IDBDatabase | null = null;

  const initDB = promisify((callback: CallableFunction) => {
    const openRequest = indexedDB.open(indexedDbKey, 1);

    openRequest.onerror = () => {
      console.error("Error opening db", openRequest.error);
      callback(openRequest.error);
    }
    openRequest.onupgradeneeded = () => {
      createDb(); // ??? test последовательности колбеков
    };
    openRequest.onsuccess = () => {
      db = openRequest.result;
      callback();
    };
  })

  const createDb = ({ target }) => {
    // срабатывает, если на клиенте нет базы данных
    // ...выполнить инициализацию...
    const db = target.result;
    db.createObjectStore(objectStore.TODOS, { keyPath: 'id' });
    const indexedStore = db.createObjectStore(objectStore.SETTINGS);
    // set default settings
    Object.keys(STORE_DEFAULT_OBJECT).forEach(key => { // ???
      indexedStore.add(STORE_DEFAULT_OBJECT[key], key)
    })
  }

  const getObjectStore = (name: string, mode: RightOfAccess = "readonly") => {
    // console.log("getObjectStore", name, mode)
    // const mode = readwrite ? "readwrite" : "readonly";
    return db?.transaction(name, mode).objectStore(name) // проверить что будет при ошибке !!! mode не верный придет или еще что
  }

  const getAllTodosFromDb = promisify((callback: CallableFunction) => {
    const request = getObjectStore(objectStore.TODOS).getAll();

    request.onsuccess = () => callback(request.result);
    request.onerror = (error) => callback(error);
  })

  const getSettingsFromDb = promisify((callback: CallableFunction) => {
    const result = {...STORE_DEFAULT_OBJECT};
    const request = getObjectStore(objectStore.SETTINGS).getAll();

    request.onsuccess = () => {
      console.log(request.result)
      Object.keys(result).forEach((key, index) => { // for in, посмотеть что возвращает
        result[key] = request.result[index];
      });
      // for (const key in result) {
      //   result[key] = request.result[key]
      // }
      // success_callback(result);
      callback(result);
    }
    request.onerror = (error) => callback(error);
  })

  const addTaskToDb = promisify((task: Todo, callback: CallableFunction) => {
    // let txrw = db.transaction(objectStore.TODOS, 'readwrite');
    // console.log("txrw", txrw);
    // const todos = txrw.objectStore(objectStore.TODOS);
    const todos = getObjectStore(objectStore.TODOS, "readwrite"); // ???
    // console.log("todos", todos)
    const request = todos.add(task);

    request.onerror = (event) => {
      // Don't forget to handle errors!
      console.error("addTaskToDb error", event.target?.error);
      // const todosStore = useTodosStore();
      // this.getAllTodosFromDb(todosStore.setTasks);
      // todosStore.deleteTodoById(task.id); - больше не добавляем в разметку перед БД
      callback(event);
    };

    request.onsuccess = () => {
      callback();
    };
  })

  const deleteTaskFromDb = (id) => {
    db.transaction(objectStore.TODOS, "readwrite")
      .objectStore(objectStore.TODOS)
      .delete(id)
  }
  const updateTask = (payload) => {
    const request = getObjectStore(objectStore.TODOS, "readwrite")
      .put(payload)
    request.onerror = (event) => console.log("Order update error", event);
  }
  const updateSetting = ({ key, value }) => {
    const request = getObjectStore(objectStore.SETTINGS, "readwrite")
      .put(value, key)
    request.onerror = (event) => console.log("Update setting error", event);
  }

  return {
    initDB,
    getAllTodosFromDb,
    getSettingsFromDb,
    addTaskToDb,
    deleteTaskFromDb,
    updateTask,
    updateSetting
  }
});
