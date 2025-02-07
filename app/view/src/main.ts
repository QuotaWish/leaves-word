import * as Sentry from '@sentry/vue'
import { loadSlim } from '@tsparticles/slim'
import Particles from '@tsparticles/vue3'
import { InstallCodeMirror } from 'codemirror-editor-vue3'
import ElementPlus from 'element-plus'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import transitionRouter from './router-transition'
import '@unocss/reset/tailwind.css'

import './styles/main.css'
import 'uno.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import './styles/element/index.scss'

import 'vant/lib/index.css'

const app = createApp(App)
const router = transitionRouter(createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
}), {
  forwardName: 'slide-left',
  backName: 'slide-right',
})

Sentry.init({
  app,
  dsn: 'https://f3bcf43e8b263241b9f1009f6ce25fdf@o4508024637620224.ingest.us.sentry.io/4508758779101184',
  integrations: [
    Sentry.browserTracingIntegration({ router }),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/api\.leavesword\.quotawish\.com(\/.*)?$/], // https://api.leavesword.quotawish.com
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

app.use(ElementPlus)
app.use(router)
app.use(InstallCodeMirror)
app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine)
  },
})
app.mount('#app')
