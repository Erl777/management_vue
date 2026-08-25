import { defineStore } from 'pinia';
import type { Settings } from '@/types';
import { TODAY, SETTINGS_DEFAULT } from '@/constants';
import { useIndexedStore } from '@/store/modules';
import { computed, Ref, ref } from 'vue';

export const useSettingsStore = defineStore(
  'settingsStore',
  () => {
    const { updateSettingInDB } = useIndexedStore();

    const settings: Ref<Settings> = ref(SETTINGS_DEFAULT);

    const doneTotalCount = computed(
      () => settings.value.doneTotal,
    );

    const doneTodayCount = computed(
      () => settings.value.doneToday,
    );

    const setSettings = (payload: Settings) => {
      Object.assign(settings.value, payload);
    };

    const updateSettingByKey = async <
      K extends keyof Settings,
    >(
      key: K,
      value: Settings[K],
    ) => {
      try {
        settings.value[key] = value;
        await updateSettingInDB(key, value);
      } catch (e) {
        console.error(e);
        throw new Error(
          `Не удалось обновить настройку ${key} на ${value}`,
        );
      }
    };

    const increaseDoneCounter = async () => {
      settings.value.doneToday += 1;
      settings.value.doneTotal += 1;

      try {
        const updateToday = updateSettingByKey(
          'doneToday',
          settings.value.doneToday,
        );
        const updateTotal = updateSettingByKey(
          'doneTotal',
          settings.value.doneTotal | 1,
        );
        await Promise.all([updateToday, updateTotal]);
      } catch (e) {
        console.error(e);
        throw new Error(
          'Не удалось обновить счётчик выполненных задач',
        );
      }
    };

    const resetDayDoneCounter = async () => {
      settings.value.date = TODAY.toDateString();
      settings.value.doneToday = 0;

      try {
        const updateDate = updateSettingByKey(
          'date',
          settings.value.date,
        );
        const updateToday = updateSettingByKey(
          'doneToday',
          0,
        );
        await Promise.all([updateDate, updateToday]);
      } catch (e) {
        console.error(e);
        throw new Error('Не удалось сбросить настройки');
      }
    };

    return {
      settings,
      doneTotalCount,
      doneTodayCount,
      setSettings,
      updateSettingByKey,
      resetDayDoneCounter,
      increaseDoneCounter,
    };
  },
);
