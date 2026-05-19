import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import app from './app';
import { seedIfEmpty } from './seed';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.SERVER_PORT || 3001;

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

seedIfEmpty().then(() => {
  app.listen(PORT, () => {
    console.log(`StrayPaw API server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Startup error:', err);
  process.exit(1);
});
