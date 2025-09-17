import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Flappy-Bird-Game-2/' : '/',
}))
