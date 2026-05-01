export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  location?: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  about: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  aiSummary?: string;
  aiHighlights?: string[];
  aiSentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Review {
  id: string;
  hotelId: string;
  hotelName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
