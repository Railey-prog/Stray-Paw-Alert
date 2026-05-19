import app from './app';
import { seedIfEmpty } from './seed';

const PORT = process.env.SERVER_PORT || 3001;

seedIfEmpty().then(() => {
  app.listen(PORT, () => {
    console.log(`StrayPaw API server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Startup error:', err);
  process.exit(1);
});
