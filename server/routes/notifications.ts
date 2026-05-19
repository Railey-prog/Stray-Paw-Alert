import { Router, Response } from 'express';
import pool from '../db';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { user_id, report_id, type, title, body } = req.body;
  if (!user_id || !type || !title || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const id = `n${Date.now()}`;
    const result = await pool.query(
      'INSERT INTO notifications (id, user_id, report_id, type, title, body) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [id, user_id, report_id || null, type, title, body]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

router.patch('/:id/read', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      'UPDATE notifications SET read=true WHERE id=$1 AND user_id=$2',
      [req.params.id, req.userId]
    );
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

router.patch('/read-all', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('UPDATE notifications SET read=true WHERE user_id=$1', [req.userId]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

router.delete('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM notifications WHERE user_id=$1', [req.userId]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

export default router;
