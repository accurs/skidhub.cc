import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(join(__dirname, 'dist')));

app.get('/api/projects', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  const { projectId } = req.query;

  if (!projectId) {
    res.status(400).json({ error: 'Project ID is required' });
    return;
  }

  try {
    const imagesDir = join(__dirname, 'public', 'projects', projectId, 'images');
    
    if (!existsSync(imagesDir)) {
      res.status(404).json({ error: 'Images directory not found' });
      return;
    }

    const files = readdirSync(imagesDir);
    const imageFiles = files
      .filter(filename => {
        const ext = filename.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'].includes(ext);
      })
      .map(filename => ({
        id: filename,
        title: filename.split('.')[0].replace(/-/g, ' ').replace(/_/g, ' '),
        url: `/projects/${projectId}/images/${filename}`,
        thumbnail: `/projects/${projectId}/images/${filename}`,
        type: filename.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image'
      }));

    res.json({ images: imageFiles });
  } catch (error) {
    console.error('Error reading images directory:', error);
    res.status(500).json({ error: 'Error reading images directory' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 