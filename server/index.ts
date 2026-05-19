import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import reportsRouter from './routes/reports';
import notificationsRouter from './routes/notifications';
import { seedIfEmpty } from './seed';

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/notifications', notificationsRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

seedIfEmpty().then(() => {
  app.listen(PORT, () => {
    console.log(`StrayPaw API server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Startup error:', err);
  process.exit(1);
});
