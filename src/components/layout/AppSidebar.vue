<script setup lang="ts">
import { useSettingsStore } from '@store/modules';
import { storeToRefs } from 'pinia';
import { settingsLabels, settingsKeys } from '@/constants';
import type { toggleableSettingsKeys } from '@/types';

const model = defineModel<boolean>();
const settingsStore = useSettingsStore();
const { updateSettingByKey } = settingsStore;
const { settings } = storeToRefs(settingsStore);

const toggleSettingByKey = (
  key: toggleableSettingsKeys
) => {
  updateSettingByKey(key, !settings.value[key]);
};
</script>

<template>
  <v-navigation-drawer
    v-model="model"
    location="left"
    temporary
  >
    <v-list>
      <v-list-item
        v-for="key in settingsKeys"
        :key="key"
        class="px-2"
      >
        <v-checkbox
          :label="settingsLabels[key]"
          :model-value="settings[key]"
          hide-details
          @change="toggleSettingByKey(key)"
        />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>
