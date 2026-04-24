export interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: number;
  thumbnailUrl?: string;
  price?: number;
}
