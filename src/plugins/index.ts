/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify';
import store from '@/store';

export function registerPlugins(app) {
  app.use(vuetify).use(store);
}
