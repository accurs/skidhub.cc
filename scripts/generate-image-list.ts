import fs from 'fs';
import path from 'path';

const projectsDir = path.join(process.cwd(), 'public', 'projects');

const projects = fs.readdirSync(projectsDir)
  .filter(name => fs.statSync(path.join(projectsDir, name)).isDirectory())
  .filter(name => name !== 'node_modules');

projects.forEach(projectId => {
  const imagesDir = path.join(projectsDir, projectId, 'images');
  
  if (!fs.existsSync(imagesDir)) {
    console.log(`No images directory found for project ${projectId}`);
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
      url: `/public/projects/${projectId}/images/${filename}`,
      thumbnail: `/public/projects/${projectId}/images/${filename}`,
      type: filename.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image'
    }));

  fs.writeFileSync(
    path.join(imagesDir, 'images.json'),
    JSON.stringify({ images: imageFiles }, null, 2)
  );

  console.log(`Generated images list for project ${projectId}`);
}); 