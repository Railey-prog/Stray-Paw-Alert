import app from '../server/app';
import { seedIfEmpty } from '../server/seed';

let booted = false;

export default async function handler(req: any, res: any) {
  if (!booted) {
    try {
      await seedIfEmpty();
      booted = true;
      console.log('Database initialized successfully');
    } catch (err: any) {
      console.error('Database initialization failed:', err.message);
      res.status(500).json({ error: 'Database initialization failed: ' + err.message });
      return;
    }
  }
  app(req, res);
}
