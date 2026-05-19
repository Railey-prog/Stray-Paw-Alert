import { Router, Request, Response } from 'express';
import pool from '../db';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM reports WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Report not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const {
    reporter_name, animal_type, other_animal_type, condition_tag,
    description, photo_url, latitude, longitude, barangay
  } = req.body;
  if (!animal_type || !condition_tag || !description || !photo_url || !latitude || !longitude || !barangay) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const id = `r${Date.now()}`;
    const result = await pool.query(
      `INSERT INTO reports
        (id, reporter_name, reporter_user_id, animal_type, other_animal_type,
         condition_tag, description, photo_url, latitude, longitude, barangay)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [id, reporter_name || null, req.userId, animal_type, other_animal_type || null,
       condition_tag, description, photo_url, latitude, longitude, barangay]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add report error:', err);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

router.patch('/bulk/status', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { ids, status, admin_notes } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids required' });
  const validStatuses = ['open', 'in-progress', 'resolved'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  try {
    await pool.query(
      `UPDATE reports SET status=$1, admin_notes=COALESCE($2, admin_notes), updated_at=NOW()
       WHERE id = ANY($3::text[])`,
      [status, admin_notes ?? null, ids]
    );
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to bulk update' });
  }
});

router.delete('/bulk/delete', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids required' });
  try {
    await pool.query('DELETE FROM reports WHERE id = ANY($1::text[])', [ids]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to bulk delete' });
  }
});

router.patch('/:id/status', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { status, admin_notes } = req.body;
  const validStatuses = ['open', 'in-progress', 'resolved'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  try {
    const result = await pool.query(
      `UPDATE reports SET status=$1, admin_notes=COALESCE($2, admin_notes), updated_at=NOW()
       WHERE id=$3 RETURNING *`,
      [status, admin_notes ?? null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Report not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update report' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM reports WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

export default router;
