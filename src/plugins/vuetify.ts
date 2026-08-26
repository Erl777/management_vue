/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '../assets/fonts/materialdesignicons.min.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';

import { ru } from 'vuetify/locale';
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  //
  locale: {
    locale: 'ru',
    fallback: 'ru',
    messages: { ru }
  }
});
