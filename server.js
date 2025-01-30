import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function createServer() {
    const app = express();

    let vite;
    if (!isProduction) {
        // Create Vite server in middleware mode
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom',
        });
        app.use(vite.middlewares);
    } else {
        app.use(express.static(path.resolve(__dirname, 'dist')));
    }

    app.use('*', async (req, res) => {
        try {
            const url = req.originalUrl;

            let template;
            let render;

            if (!isProduction) {
                // Read and transform index.html using Vite in development
                template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
                template = await vite.transformIndexHtml(url, template);

                render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
            } else {
                template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
                render = (await import('./dist/server/entry-server.js')).render;
            }

            const appHtml = render(url);
            const html = template.replace('<!--ssr-outlet-->', appHtml);

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            vite?.ssrFixStacktrace(e);
            console.error(e);
            res.status(500).end(e.stack);
        }
    });

    app.listen(3000, () => {
        console.log('Server is running at http://localhost:3000');
    });
}

createServer();
