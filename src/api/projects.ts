import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { projectId } = req.query;

  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  try {
    const imagesDir = path.join(process.cwd(), 'public', 'projects', projectId, 'images');
    
    if (!fs.existsSync(imagesDir)) {
      return res.status(404).json({ message: 'Images directory not found' });
    }

    const files = fs.readdirSync(imagesDir)
      .filter(filename => {
        const ext = path.extname(filename).toLowerCase().slice(1);
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'].includes(ext);
      });

    res.status(200).json({ files });
  } catch (error) {
    console.error('Error reading images directory:', error);
    res.status(500).json({ message: 'Error reading images directory' });
  }
}

export async function listImages(projectId: string) {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'projects', projectId, 'images');
    
    if (!fs.existsSync(imagesDir)) {
      console.log('Images directory not found:', imagesDir);
      return { files: [] };
    }

    const files = fs.readdirSync(imagesDir)
      .filter(filename => {
        const ext = path.extname(filename).toLowerCase().slice(1);
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov'].includes(ext);
      });

    console.log('Found files:', files);
    return { files };
  } catch (error) {
    console.error('Error reading images directory:', error);
    return { files: [] };
  }
} 