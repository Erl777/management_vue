import { defineStore } from 'pinia';
import type {
  RightsOfAccess,
  ObjectStoreValues,
  Todo,
  SettingsKeys,
  TodoId,
  StoreMethod,
  SettingsValues,
  Settings,
  Todos
} from '@/types';
import { promisify } from '@/utils';
import {
  indexedDbKey,
  SETTINGS_DEFAULT,
  objectStore
} from '@/constants';

export const useIndexedStore = defineStore(
  'databaseStore',
  () => {
    let db: IDBDatabase | null = null;

    const initDB = promisify(
      (callback: CallableFunction) => {
        const openRequest = indexedDB.open(indexedDbKey, 2);

        openRequest.onerror = () => {
          console.error(
            'Error opening db',
            openRequest.error
          );
          callback(null, openRequest.error);
        };
        // срабатывает, если на клиенте нет базы данных ( выполнить инициализацию )
        // или при изменении версии db на более новую
        openRequest.onupgradeneeded = (event) => {
          createDb(event);
        };

        openRequest.onsuccess = async () => {
          db = openRequest.result;
          await removeDeprecatedTodos(db);
          callback();
        };
      }
    );

    const createDb = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest)?.result;
      if (!db) {
        console.error('Create DB error. Has not target');
        return;
      }
      if (db.objectStoreNames.length === 0) {
        db.createObjectStore(objectStore.TODOS, {
          keyPath: 'id'
        });
        const indexedStore = db.createObjectStore(
          objectStore.SETTINGS
        );
        // set default settings
        const settingsKeysArr = Object.keys(
          SETTINGS_DEFAULT
        ) as SettingsKeys[];
        settingsKeysArr.forEach((key) => {
          indexedStore.add(SETTINGS_DEFAULT[key], key);
        });
      }
    };

    const removeDeprecatedTodos = promisify(
      (db: IDBDatabase, callback: CallableFunction) => {
        const todosObjStore = db
          .transaction(objectStore.TODOS, 'readwrite')
          .objectStore(objectStore.TODOS);
        if (todosObjStore) {
          const request = todosObjStore.getAll();
          if (request) {
            request.onsuccess = () => {
              const deprecatedItems = request.result.filter(
                (item) => item.title
              );
              if (deprecatedItems.length) {
                deprecatedItems.forEach((item) => {
                  todosObjStore.delete(item.id);
                });
              }
              callback();
            };
            request.onerror = (error) => callback(error);
          }
        } else {
          console.error('trans fail for deprecated items');
          callback(
            new Error('trans fail for deprecated items')
          );
        }
      }
    );

    const getObjectStore = (
      name: ObjectStoreValues,
      mode: RightsOfAccess = 'readonly'
    ): IDBObjectStore => {
      if (!db) {
        throw new Error(
          'Database is not initialized. Call initDB() first.'
        );
      }
      return db.transaction(name, mode).objectStore(name);
    };

    const createStoreRequest = <TInput, TResult>(
      method: StoreMethod
    ) =>
      promisify<[TInput], TResult>((payload, callback) => {
        const store = getObjectStore(
          objectStore.TODOS,
          'readwrite'
        );
        const request = (
          store[method] as (value: TInput) => IDBRequest
        )(payload);

        request.onsuccess = () =>
          callback(request.result as TResult, null);
        request.onerror = () =>
          callback(null, request.error);
      });

    const addTaskToDB = createStoreRequest<
      Todo,
      IDBValidKey
    >('add');
    const updateTaskInDB = createStoreRequest<
      Todo,
      IDBValidKey
    >('put');
    const deleteTaskFromDB = createStoreRequest<
      TodoId,
      undefined
    >('delete');

    const getAllTodosFromDb = promisify<[], Todos>(
      (callback) => {
        const request: IDBRequest<Todos> = getObjectStore(
          objectStore.TODOS
        ).getAll();

        request.onsuccess = () =>
          callback(request.result as Todos, null);
        request.onerror = () =>
          callback(null, request.error);
      }
    );

    const getSettingsFromDb = promisify<[], Settings>(
      (callback) => {
        const request = getObjectStore(
          objectStore.SETTINGS
        ).getAllRecords<IDBValidKey, SettingsValues>();
        request.onsuccess = () => {
          const settings = [...request.result].map(
            ({ key, value }) => [key, value]
          );
          const result = Object.fromEntries(
            settings
          ) as Settings;
          callback(result, null);
        };
        request.onerror = () =>
          callback(null, request.error);
      }
    );

    const updateSettingInDB = promisify<
      [SettingsKeys, SettingsValues],
      IDBValidKey
    >((key, value, callback) => {
      const request = getObjectStore(
        objectStore.SETTINGS,
        'readwrite'
      ).put(value, key);

      if (request) {
        request.onsuccess = () =>
          callback(request.result, null);
        request.onerror = () =>
          callback(null, request.error);
      }
    });

    return {
      initDB,
      getAllTodosFromDb,
      getSettingsFromDb,
      addTaskToDB,
      updateTaskInDB,
      deleteTaskFromDB,
      updateSettingInDB
    };
  }
);
