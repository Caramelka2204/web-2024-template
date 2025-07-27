export interface User {
  id: string;
  login: string;
  password: string;
  role: 'group' | 'teacher';
  group: string | null;
  firstName: string;
  lastName: string;
  category: string;
  photoUrl?: string;
  isApproved: boolean;
  isRejected?: boolean;
  rejectionComment?: string;
} 