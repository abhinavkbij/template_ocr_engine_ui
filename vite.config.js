import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), tailwindcss(),],
    // base: 'https://abhinavkbij.github.io/template_ocr_engine_ui/',
    base: '/template_ocr_engine_ui/'
})
