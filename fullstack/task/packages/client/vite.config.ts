import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Завантажуємо змінні середовища з файлу .env
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react(), tsconfigPaths()],
        define: {
            VITE_GRAPH_QL_URL: JSON.stringify(env.VITE_GRAPH_QL_URL),
        },
        server: {
            proxy: {
                "/api": env.VITE_GRAPH_QL_URL, // Якщо хочеш використовувати проксі
            },
        },
    };
});
