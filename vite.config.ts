// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import VueRouter from 'unplugin-vue-router/vite'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VueRouter(),
        Vue({
            template: {transformAssetUrls}
        }),
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: 'auto',
            devOptions: {enabled: true},
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /\.(?:woff|woff2|)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'fonts',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
                            },
                        },
                    },
                ],
            },
            includeAssets:
                ['fonts/*.woff2', 'images/*.png', 'css/*.css'],
            manifest: {
                "theme_color": "#1867c0",
                "background_color": "#546e79",
                "icons": [
                    {
                        "purpose": "maskable",
                        "sizes": "512x512",
                        "src": "icon512_maskable.png",
                        "type": "image/png"
                    },
                    {
                        "purpose": "any",
                        "sizes": "512x512",
                        "src": "icon512_rounded.png",
                        "type": "image/png"
                    }
                ],
                "orientation": "portrait",
                "display": "standalone",
                "dir": "auto",
                "lang": "ru-RU",
                "name": "Management",
                "start_url": "/",
                "scope": "/",
                "prefer_related_applications": false
            }
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
        Vuetify({
            autoImport: true,
            styles: {
                configFile: 'src/styles/settings.scss',
            },
        }),
        Components(),
        ViteFonts({
            google: {
                families: [
                    {
                        name: 'Roboto',
                        styles: 'wght@100;300;400;500;700;900',
                    },
                ],
            },
        }),
    ],
    define: {'process.env': {}},
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
        ],
    },
    server: {
        port: 9000,
    },
})
