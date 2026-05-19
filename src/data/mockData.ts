import { Report, User } from '../types';

export const mockUsers: User[] = [
{
  id: 'u1',
  username: 'admin',
  email: 'admin@tago.gov.ph',
  role: 'admin',
  created_at: new Date('2023-01-01').toISOString()
},
{
  id: 'u2',
  username: 'juan_delacruz',
  email: 'juan@example.com',
  role: 'resident',
  created_at: new Date('2023-05-15').toISOString()
}];


export const mockReports: Report[] = [
{
  id: 'r1',
  reporter_name: 'Maria Santos',
  animal_type: 'dog',
  condition_tag: 'aggressive',
  description: 'Large brown dog chasing motorcycles near the plaza.',
  photo_url:
  'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800',
  latitude: 9.0373,
  longitude: 126.1973,
  barangay: 'Tago Poblacion',
  status: 'open',
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
},
{
  id: 'r2',
  reporter_name: 'Anonymous',
  animal_type: 'cat',
  condition_tag: 'injured',
  description: 'Small kitten with a hurt leg hiding under a parked jeepney.',
  photo_url:
  'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800',
  latitude: 9.041,
  longitude: 126.201,
  barangay: 'Cagdianao',
  status: 'in-progress',
  admin_notes: 'Animal control dispatched to location.',
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
},
{
  id: 'r3',
  reporter_name: 'Pedro',
  animal_type: 'dog',
  condition_tag: 'roaming',
  description: 'White dog with no collar wandering around the market.',
  photo_url:
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
  latitude: 9.025,
  longitude: 126.185,
  barangay: 'Mainit',
  status: 'resolved',
  admin_notes: 'Owner found and contacted.',
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  updated_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
},
{
  id: 'r4',
  reporter_name: 'Elena',
  animal_type: 'other',
  condition_tag: 'needs_rescue',
  description: 'Goat stuck in a deep drainage ditch.',
  photo_url:
  'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=800',
  latitude: 9.052,
  longitude: 126.191,
  barangay: 'Sumo',
  status: 'open',
  created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
},
{
  id: 'r5',
  reporter_name: 'Jose',
  animal_type: 'dog',
  condition_tag: 'injured',
  description: 'Skinny dog looking for food, seems to have a skin condition.',
  photo_url:
  'https://images.unsplash.com/photo-1537151608804-ea6f11840865?auto=format&fit=crop&q=80&w=800',
  latitude: 9.015,
  longitude: 126.21,
  barangay: 'Anahao',
  status: 'open',
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
}];