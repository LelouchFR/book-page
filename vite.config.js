import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    base: './',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
    build: {
        outDir: 'dist',
        rolldownOptions: {
            input: {
                newtab: resolve(import.meta.dirname, './index.html')
            }
        }
    }
});
