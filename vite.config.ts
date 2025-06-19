import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import type { ViteDevServer } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    allowedHosts: ['skidhub.cc', 'localhost', '127.0.0.1'],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'list-project-images',
      configureServer(server: ViteDevServer) {
        server.middlewares.use('/api/projects', (req, res) => {
          // Set CORS headers
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.setHeader('Content-Type', 'application/json');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method !== 'GET') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          try {
            const url = new URL(req.url || '', 'http://localhost');
            const projectId = url.searchParams.get('projectId');

            if (!projectId) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Project ID is required' }));
              return;
            }

            const imagesDir = path.join(process.cwd(), 'public', 'projects', projectId, 'images');
            
            if (!fs.existsSync(imagesDir)) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Images directory not found' }));
              return;
            }

            const files = fs.readdirSync(imagesDir);
            const imageFiles = files
              .filter(filename => {
                const ext = path.extname(filename).toLowerCase().slice(1);
                return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'].includes(ext);
              })
              .map(filename => ({
                id: filename,
                title: path.parse(filename).name.replace(/-/g, ' ').replace(/_/g, ' '),
                url: `/projects/${projectId}/images/${filename}`,
                thumbnail: `/projects/${projectId}/images/${filename}`,
                type: filename.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image'
              }));

            res.end(JSON.stringify({ images: imageFiles }));
          } catch (error) {
            console.error('Error reading images directory:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Error reading images directory' }));
          }
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
