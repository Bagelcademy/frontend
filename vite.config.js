import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
    const isSSR = command === 'build' && process.env.SSR === 'true';

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@mohsen007/react-goftino': '@mohsen007/react-goftino/dist',
            },
        },
        build: {
            ssr: isSSR ? 'src/entry-server.jsx' : false, // SSR or client build
            outDir: isSSR ? 'dist/server' : 'dist', // Separate output directories
            rollupOptions: {
                input: isSSR ? undefined : 'index.html', // Input for client build
            },
        },
        ssr: {
            noExternal: ["@uiw/react-codemirror", "@uiw/codemirror-extensions-basic-setup"], // Prevent bundling for SSR
        },
        define: {
            "process.env.SSR": isSSR ? "true" : "false", // Set SSR flag for both builds
        },
    };
});
