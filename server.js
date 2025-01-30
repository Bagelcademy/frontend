import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const __dirname = path.resolve();

async function createServer() {
    const app = express();

    let vite;
    if (!isProduction) {
        // Vite in middleware mode (for development)
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom',
        });
        app.use(vite.middlewares);
    } else {
        // Serve static files from the built `dist/` folder
        app.use(express.static(path.join(__dirname, 'dist')));
    }

    // Handle all requests and serve SSR content
    app.get('*', async (req, res) => {
        try {
            const url = req.originalUrl;

            let template;
            let render;

            if (!isProduction) {
                // Development: Load and transform index.html dynamically
                template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
                template = await vite.transformIndexHtml(url, template);
                render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
            } else {
                // Production: Serve prebuilt HTML and SSR output
                const indexPath = path.join(__dirname, 'dist', 'index.html');
                if (!fs.existsSync(indexPath)) {
                    return res.status(404).send('Error: index.html not found in dist/');
                }

                template = fs.readFileSync(indexPath, 'utf-8');
                render = (await import('./dist/server/entry-server.js')).render;
            }

            // Generate and send HTML response
            const appHtml = render(url);
            const html = template.replace('<!--ssr-outlet-->', appHtml);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            if (!isProduction) vite?.ssrFixStacktrace(e);
            console.error('SSR Error:', e);
            res.status(500).end(e.stack);
        }
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
}

createServer();
