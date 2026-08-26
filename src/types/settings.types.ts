import {
  SETTINGS_DEFAULT,
  settingsLabels
} from '@/constants';

export type Settings = typeof SETTINGS_DEFAULT;

export type SettingsKeys = keyof Settings;

export type SettingsValues =
  (typeof SETTINGS_DEFAULT)[keyof typeof SETTINGS_DEFAULT];

export type toggleableSettingsKeys =
  keyof typeof settingsLabels;
