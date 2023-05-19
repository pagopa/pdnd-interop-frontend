import { defineConfig } from 'cypress'

export default defineConfig({
  // To be able to test the app without cors protection
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:3000/ui/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
