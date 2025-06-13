
export enum SenderType {
  ME = 'me',
  OTHER = 'other',
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: SenderType;
  date: string; // YYYY-MM-DD for grouping
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
  status?: string; 
}

export interface ChatParticipant {
  name: string;
  avatarUrl: string;
}
