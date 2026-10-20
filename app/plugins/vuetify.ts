import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

// Placeholder theme until the design is finalised. Swap these values for the
// brand palette and keep component defaults here rather than in templates.
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#1f2a44',
            secondary: '#4a6cf7',
            background: '#ffffff',
            surface: '#ffffff',
          },
        },
      },
    },
    defaults: {
      VBtn: { rounded: 'lg', flat: true },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
