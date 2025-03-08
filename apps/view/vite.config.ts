import { sentryVitePlugin } from '@sentry/vite-plugin'
/// <reference types="vitest" />

import path from 'node:path'
import process from 'node:process'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, loadEnv } from 'vite'
import { vitePluginVersionMark } from 'vite-plugin-version-date-mark'

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },

    plugins: [VueMacros({
      defineOptions: false,
      defineModels: false,
      plugins: {
        vue: Vue({
          script: {
            propsDestructure: true,
            defineModel: true,
          },
        }),
      },
    }), // https://github.com/posva/unplugin-vue-router
    VueRouter(), // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          'vue-router/auto': ['useLink'],
        },
      ],
      dts: true,
      dirs: [
        './src/composables',
      ],
      vueTemplate: true,
    }), // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
    }), // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS({}),
    // sentry connect
    sentryVitePlugin({
      authToken: env.VITE_SENTRY_AUTH_TOKEN,
      org: 'quotawish',
      project: 'leaves_word',
    }),
    // version displayer
    vitePluginVersionMark({
      name: 'LEAVES_WORD',
      ifShortSHA: true,
      ifMeta: true,
      ifLog: true,
      ifGlobal: true,
    })],

    // https://github.com/vitest-dev/vitest
    test: {
      environment: 'jsdom',
    },

    build: {
      sourcemap: true,
    },
  })
}
