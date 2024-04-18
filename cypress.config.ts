import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    email: "test1@gmail.com",
    password: "test1",
  },
  e2e: {
    baseUrl: "http://localhost:3001",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
