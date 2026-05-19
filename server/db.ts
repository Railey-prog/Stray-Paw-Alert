import { Pool } from 'pg';

const isExternal = process.env.DATABASE_URL?.includes('supabase.co') ||
                   process.env.DATABASE_URL?.includes('neon.tech') ||
                   process.env.DATABASE_URL?.includes('amazonaws.com');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isExternal ? { rejectUnauthorized: false } : false,
});

export default pool;
