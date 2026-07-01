import { defineStore } from "pinia";
import { STORE_DEFAULT_OBJECT, TODAY } from "@/assets/js/consts/constants";
import { useIndexedStore } from "@/store/modules/indexed/useIndexedStore";
import { computed, ref } from "vue";

export const useSettingsStore = defineStore('settings', () => {
  const { updateSetting } = useIndexedStore();

  const settings = ref({...STORE_DEFAULT_OBJECT});

  const getDoneTotalCount = computed(() => {
    return settings.value.doneTotal;
  })

  const getDoneTodayCount = computed(() => {
    return settings.value.doneToday;
  })

  // настройки сетятся в стору
  const setSettings = (payload) => {
    Object.assign(settings.value, payload);
    // Object.keys(payload).forEach(key => {
    //   settings[key] = payload[key];
    // })
  }

  // настройки
  const updateSettingByKey = ({ key, value }) => {
    settings.value[key] = value;
    // async try catch
    updateSetting({ key, value })
  }

  const resetDayDoneCounter = () => { // включить позже
    console.log("RESET !!!");
    settings.value.date = TODAY.toDateString();
    settings.value.doneToday = 0;
    // Promise all
    updateSetting({ key: STORE_DEFAULT_OBJECT.date, value: this.date })
    updateSetting({ key: STORE_DEFAULT_OBJECT.doneToday, value: 0 })
  }

  return {
    settings,
    getDoneTotalCount,
    getDoneTodayCount,
    setSettings,
    updateSettingByKey,
    resetDayDoneCounter,
  }
});
