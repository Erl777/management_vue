import { defineStore } from "pinia";
import { indexedDbKey, STORE_DEFAULT_OBJECT } from "@/assets/js/consts/constants";
import { useTodosStore } from "@/store/modules/todos/useTodosStore";

const objectStore = {
  TODOS: "todos",
  SETTINGS: "settings"
}

export const useIndexedStore = defineStore('database',{
  state: () => ({
    db: null,
  }),
  actions: {
    init(success_callback) {
      const openRequest = indexedDB.open(indexedDbKey, 1);

      openRequest.onerror = function() {
        console.error("Error", openRequest.error);
      };

      openRequest.onupgradeneeded = () => {
        // срабатывает, если на клиенте нет базы данных
        // ...выполнить инициализацию...
        let db = openRequest.result;
        db.createObjectStore(objectStore.TODOS, {keyPath: 'id'});
        let indexedStore = db.createObjectStore(objectStore.SETTINGS);
        // set default settings
        Object.keys(STORE_DEFAULT_OBJECT).forEach(key => {
          indexedStore.add(STORE_DEFAULT_OBJECT[key], key)
        })
      };

      openRequest.onsuccess = async () => {
        this.db = openRequest.result;
        // продолжить работу с базой данных, используя объект db
        const todosStore = useTodosStore();

        // this.db.onerror = function(event) {
        //   let request = event.target; // запрос, в котором произошла ошибка
        //
        //   console.log("Ошибка глобальная", request);
        // };

        await this.getSettingsFromDb(todosStore.setState)
        await this.getAllTodosFromDb(todosStore.setTasks);
        success_callback();
      };
    },
    getObjectStore(name, readwrite) {
      const mode = readwrite ? "readwrite" : "readonly";
      return this.db.transaction(name, mode).objectStore(name)
    },
    getAllTodosFromDb(success_callback) {
      return new Promise((resolve, reject) => {
        let getAllRequest = this.getObjectStore(objectStore.TODOS).getAll();

        getAllRequest.onsuccess = () => {
          success_callback(getAllRequest.result);
          resolve();
        };
        getAllRequest.onerror = (error) => reject(error);
      })
    },
    getSettingsFromDb(success_callback) {
      return new Promise((resolve, reject) => {
        const result = {...STORE_DEFAULT_OBJECT};
        const request = this.getObjectStore(objectStore.SETTINGS).getAll();

        request.onsuccess = () => {
          Object.keys(result).forEach((key, index) => {
            result[key] = request.result[index];
          });
          success_callback(result);
          resolve();
        }
        request.onerror = (error) => reject(error);
      })
    },
    addTaskToDb(task, success_callback, error_callback) {
      let txrw = this.db.transaction(objectStore.TODOS, 'readwrite');
      const todos = txrw.objectStore(objectStore.TODOS);
      let request = todos.add(task);

      request.onerror = (event) => {
        // Don't forget to handle errors!
        console.log("txrw error", event);
        const todosStore = useTodosStore();
        // this.getAllTodosFromDb(todosStore.setTasks);
        todosStore.deleteTodoById(task.id);
        if (error_callback) error_callback()
      };

      request.onsuccess = () => {
        if (success_callback) success_callback()
      };
    },
    updateOrdersInDb(payload) {
      if(payload.length) {

        const todos = this.db.transaction(objectStore.TODOS, 'readwrite').objectStore(objectStore.TODOS)

        payload.forEach(item => {
          let request = todos.put(item)

          request.onerror = (event) => {
            // Don't forget to handle errors!
            console.log("Order update error", event);
          };
        });

      }
    },
    deleteTaskFromDb(id) {
      this.db.transaction(objectStore.TODOS, 'readwrite')
        .objectStore(objectStore.TODOS)
        .delete(id)
    },
    updateTask(payload) {
      let request = this.getObjectStore(objectStore.TODOS, true)
        .put(payload)
      request.onerror = (event) => console.log("Order update error", event);
    },
    updateSetting({ key, value }) {
      let request = this.getObjectStore(objectStore.SETTINGS, true)
        .put(value, key)
      request.onerror = (event) => console.log("Update setting error", event);
    }
  }
});
