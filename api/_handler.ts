import app from '../server/app';
import { seedIfEmpty } from '../server/seed';

let booted = false;

export default async function handler(req: any, res: any) {
  if (!booted) {
    await seedIfEmpty().catch(console.error);
    booted = true;
  }
  app(req, res);
}
