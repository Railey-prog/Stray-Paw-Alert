export type AnimalType = 'dog' | 'cat' | 'other';
export type ConditionTag = 'injured' | 'aggressive' | 'roaming' | 'needs_rescue';
export type ReportStatus = 'open' | 'in-progress' | 'resolved';
export type Role = 'resident' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  status?: 'active' | 'suspended';
  created_at: string;
  /** SHA-256 hex digest of the password. Optional for backwards compatibility. */
  password_hash?: string;
}

export interface Report {
  id: string;
  reporter_name?: string;
  reporter_user_id?: string;
  animal_type: AnimalType;
  other_animal_type?: string;
  condition_tag: ConditionTag;
  description: string;
  photo_url: string;
  latitude: number;
  longitude: number;
  barangay: string;
  status: ReportStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  report_id: string;
  type: 'status_change';
  title: string;
  body: string;
  created_at: string;
  read: boolean;
}