import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function spaFallback404(): Plugin {
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    enforce: 'post',
    buildEnd() {
      const indexPath = join(process.cwd(), 'dist', 'index.html')
      if (!existsSync(indexPath)) return
      copyFileSync(indexPath, join(process.cwd(), 'dist', '404.html'))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback404()],
})
