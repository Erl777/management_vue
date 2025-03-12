/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
// import '@mdi/font/css/materialdesignicons.css' // - все иконки, но они не сохраняются в кэш из-за ?v=7.0.96 в url
// import '../assets/fonts/materialCustomIcons.css' // - вариант с урезанным кол-вом иконок
import '../assets/fonts/materialdesignicons.min.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

import { ru } from 'vuetify/locale'
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  //
  locale: {
    locale: 'ru',
    fallback: 'ru',
    messages: { ru }
  }
})
