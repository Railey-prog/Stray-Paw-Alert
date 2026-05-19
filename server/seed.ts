import bcrypt from 'bcryptjs';
import pool from './db';

const DEMO_USERS = [
  { id: 'u1', username: 'admin', email: 'admin@tago.gov.ph', password: 'tago2024', role: 'admin' },
  { id: 'u2', username: 'juan_delacruz', email: 'juan@example.com', password: 'juan2024', role: 'resident' },
];

const DEMO_REPORTS = [
  {
    id: 'r1', reporter_name: 'Maria Santos', animal_type: 'dog', condition_tag: 'aggressive',
    description: 'Large brown dog chasing motorcycles near the plaza.',
    photo_url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800',
    latitude: 9.0336, longitude: 126.2094, barangay: 'Victoria', status: 'open',
  },
  {
    id: 'r2', reporter_name: 'Anonymous', animal_type: 'cat', condition_tag: 'injured',
    description: 'Small kitten with a hurt leg hiding under a parked jeepney.',
    photo_url: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800',
    latitude: 9.0103, longitude: 126.1952, barangay: 'Camagong', status: 'in-progress',
    admin_notes: 'Animal control dispatched to location.',
  },
  {
    id: 'r3', reporter_name: 'Pedro', animal_type: 'dog', condition_tag: 'roaming',
    description: 'White dog with no collar wandering around the market.',
    photo_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
    latitude: 9.0072, longitude: 126.1681, barangay: 'Gamut', status: 'resolved',
    admin_notes: 'Owner found and contacted.',
  },
  {
    id: 'r4', reporter_name: 'Elena', animal_type: 'other', other_animal_type: 'Goat',
    condition_tag: 'needs_rescue', description: 'Goat stuck in a deep drainage ditch.',
    photo_url: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=800',
    latitude: 8.9771, longitude: 126.2384, barangay: 'Sumo-sumo', status: 'open',
  },
  {
    id: 'r5', reporter_name: 'Jose', animal_type: 'dog', condition_tag: 'injured',
    description: 'Skinny dog looking for food, seems to have a skin condition.',
    photo_url: 'https://images.unsplash.com/photo-1537151608804-ea6f11840865?auto=format&fit=crop&q=80&w=800',
    latitude: 8.9630, longitude: 126.1608, barangay: 'Anahao Bag-o', status: 'open',
  },
];

export async function seedIfEmpty() {
  const { rows: userRows } = await pool.query('SELECT COUNT(*) FROM users');
  const { rows: reportRows } = await pool.query('SELECT COUNT(*) FROM reports');
  if (parseInt(userRows[0].count) > 0 && parseInt(reportRows[0].count) > 0) return;

  console.log('Seeding demo data...');
  for (const u of DEMO_USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      `INSERT INTO users (id, username, email, password_hash, role, status)
       VALUES ($1,$2,$3,$4,$5,'active') ON CONFLICT DO NOTHING`,
      [u.id, u.username, u.email, hash, u.role]
    );
  }
  for (const r of DEMO_REPORTS) {
    await pool.query(
      `INSERT INTO reports
        (id, reporter_name, animal_type, other_animal_type, condition_tag, description,
         photo_url, latitude, longitude, barangay, status, admin_notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT DO NOTHING`,
      [r.id, r.reporter_name, r.animal_type, (r as any).other_animal_type || null,
       r.condition_tag, r.description, r.photo_url, r.latitude, r.longitude,
       r.barangay, r.status, (r as any).admin_notes || null]
    );
  }
  console.log('Seed complete.');
}
