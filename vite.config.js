import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    base: './',
    build: {
        outDir: 'dist',
        rolldownOptions: {
            input: {
                newtab: resolve(import.meta.dirname, './index.html')
            }
        }
    }
});
