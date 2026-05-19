import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import reportsRouter from './routes/reports';
import notificationsRouter from './routes/notifications';

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/notifications', notificationsRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

export default app;
