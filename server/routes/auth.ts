import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { requireAuth, JWT_SECRET, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }
  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE LOWER(username)=$1 OR LOWER(email)=$2',
      [username.trim().toLowerCase(), email.trim().toLowerCase()]
    );
    if (existing.rows.length > 0) {
      const clash = existing.rows[0];
      const isUser = await pool.query('SELECT username FROM users WHERE LOWER(username)=$1', [username.trim().toLowerCase()]);
      if (isUser.rows.length > 0) return res.status(409).json({ error: 'That username is already taken.' });
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const id = `u${Date.now()}`;
    const result = await pool.query(
      `INSERT INTO users (id, username, email, password_hash, role, status)
       VALUES ($1, $2, $3, $4, 'resident', 'active') RETURNING id, username, email, role, status, created_at`,
      [id, username.trim(), email.trim().toLowerCase(), hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(username)=$1',
      [username.trim().toLowerCase()]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'No account found with that username.' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Incorrect password.' });
    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Contact an administrator.' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password_hash, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, role, status, created_at FROM users WHERE id=$1',
      [req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
