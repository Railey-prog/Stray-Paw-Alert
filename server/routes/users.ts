import { Router, Response } from 'express';
import pool from '../db';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at ASC'
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.patch('/:id/role', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['resident', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (id === req.userId) return res.status(400).json({ error: 'Cannot change your own role.' });
  if (role === 'resident') {
    const admins = await pool.query("SELECT id FROM users WHERE role='admin'");
    if (admins.rows.length <= 1) return res.status(400).json({ error: 'Cannot demote the last admin.' });
  }
  try {
    const result = await pool.query(
      'UPDATE users SET role=$1 WHERE id=$2 RETURNING id, username, email, role, status, created_at',
      [role, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

router.patch('/:id/suspension', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (id === req.userId) return res.status(400).json({ error: 'Cannot suspend yourself.' });
  try {
    const result = await pool.query(
      `UPDATE users SET status = CASE WHEN status='suspended' THEN 'active' ELSE 'suspended' END
       WHERE id=$1 RETURNING id, username, email, role, status, created_at`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update suspension' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (id === req.userId) return res.status(400).json({ error: 'Cannot delete yourself.' });
  try {
    const target = await pool.query('SELECT role FROM users WHERE id=$1', [id]);
    if (target.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    if (target.rows[0].role === 'admin') {
      const admins = await pool.query("SELECT id FROM users WHERE role='admin'");
      if (admins.rows.length <= 1) return res.status(400).json({ error: 'Cannot delete the last admin.' });
    }
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
