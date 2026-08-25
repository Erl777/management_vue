import { toggleableSettingsKeys } from '@/types';

export const localStorageKey = 'management_demo';
export const indexedDbKey = 'management';

export const TODAY = new Date();
export const TODO_OUTDATED_DAYS_VALUE = 30;
export const TODO_OUTDATED_MONTHS_VALUE = 3;

export const objectStore = {
  TODOS: 'todos',
  SETTINGS: 'settings',
} as const;

export const SETTINGS_DEFAULT = {
  date: TODAY.toDateString(),
  doneToday: 0,
  doneTotal: 0,
  // app settings
  hide_efficient: false,
  short_card_titles: false,
};

export const settingsLabels = {
  hide_efficient: 'Скрывать эффективность',
  short_card_titles: 'Короткие заголовки и описание задач',
};

export const settingsKeys = Object.keys(
  settingsLabels,
) as toggleableSettingsKeys[];

export const WEEKDAYS = [
  {
    title: 'Пн',
    value: 1,
  },
  {
    title: 'Вт',
    value: 2,
  },
  {
    title: 'Ср',
    value: 3,
  },
  {
    title: 'Чт',
    value: 4,
  },
  {
    title: 'Пт',
    value: 5,
  },
  {
    title: 'Сб',
    value: 6,
  },
  {
    title: 'Вс',
    value: 0,
  },
];

export const swatches = [
  ['#FF0000', '#AA0000', '#ff00ff'],
  ['#FFFF00', '#AAAA00', '#aa00aa'],
  ['#00FFFF', '#00AAAA', '#006464'],
  ['#0000FF', '#0000AA', '#000064'],
];
