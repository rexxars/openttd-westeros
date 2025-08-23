import { defineConfig } from "vite";

export default defineConfig({
  preview: {
    allowedHosts: ['rubysrealm.net'],
    host: '0.0.0.0',
  }
})