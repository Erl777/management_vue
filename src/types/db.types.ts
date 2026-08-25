import { objectStore } from '@/constants';

export type ObjectStoreValues = (typeof objectStore)[keyof typeof objectStore];

export type RightsOfAccess = 'readwrite' | 'readonly';

export type StoreMethod = 'add' | 'put' | 'delete';

export interface IDBRecord<K extends IDBValidKey, V> {
  key: K;
  value: V;
}

declare global {
  export interface IDBObjectStore {
    getAllRecords<
      K extends IDBValidKey = IDBValidKey,
      V = unknown,
    >(
      query?: IDBValidKey | IDBKeyRange,
      count?: number,
    ): IDBRequest<IDBRecord<K, V>[]>;
  }
}
