export type EventType = 'formation' | 'seminaire' | 'conference' | 'ceremonie';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface Event {
  id?: number;
  title: string;
  description: string;
  type: EventType;
  date: string;
  end_date?: string;
  location: string;
  max_participants?: number;
  current_participants?: number;
  price?: number | null;
  formatted_price?: string;
  image?: string;
  image_url?: string;
  status: EventStatus;
  created_at?: string;
  updated_at?: string;
  // Champ local uniquement — jamais envoyé tel quel au backend
  _imageFile?: File | null;
}
