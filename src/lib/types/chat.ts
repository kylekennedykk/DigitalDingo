export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  complete?: boolean;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  contactInfo?: ContactInfo;
  createdAt: Date;
  updatedAt: Date;
} 