/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
// import axios from "@/plugins/axios";

// Composables
import { createApp } from 'vue'
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

const app = createApp(App)
// app.config.globalProperties.$axios = axios;

registerPlugins(app)

app.mount('#app')
