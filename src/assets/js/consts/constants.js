export const localStorageKey = "management_demo";
export const indexedDbKey = "management";
export const TASK_PRIORITY = {
  DONE: -1,
  DEFERRED: 0,
  NORMAL: 1,
  IMPORTANT: 2,
  URGENT: 3,
  IMP_AND_URG: 4,
  TODAY: 5
}

export const TODAY = new Date()
export const TODO_OUTDATED_DAYS_VALUE = 30;

export const STORE_DEFAULT_OBJECT = {
  date: TODAY.toDateString(),
  doneToday: 0,
  doneTotal: 0,
  // tasks: [],
  // app settings
  hide_efficient: false,
  hide_labels: false,
  short_card_titles: false,
}

export const TABS = {
  IN_WORK: 'list',
  DONE: 'done'
}

export const isToday = (deferred) => TODAY.toDateString() === new Date(deferred).toDateString()

const structure = {
  tasks: [
    {
      id: 0,
      title: 'Задача 1',
      description: 'описание задачи 1',
      urgent: false,
      important: false,
      deferred: '2024-07-05', // String || null
      isDone: false,
      done: '2024-07-31T08:11:54.823Z', // String || null
      repeated: false,
      // priority: 0 - рассчитывается на лету
      hidden: null // String || null
    },
  ]
}

// <v-img height="300" src="@/assets/logo_old.svg" />

/*
* кнопка настройки с диалоговым окном как в примере
* добавить категории ( быстрая, долгая, задача дня, прибыльная )
* добавить категории с иконками ( семья, отношения, деньги, спорт, хобби )
* */


/*
* СОХРАНИТЬ УРЛ ПЕРД БИЛДОМ ИЗ ДИСТА !!!
* css: src:url(materialdesignicons-webfont-DttUABo4.eot?v=7.0.96);
* html: ./assets/materialdesignicons-webfont-DttUABo4.eot
* */

// сохранять статистику за каждый день ???
// иконки ?
// -----------------------
