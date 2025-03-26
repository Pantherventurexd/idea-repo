export interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen: Date;
  bio?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: "image" | "document" | "video" | "audio";
  url: string;
  name: string;
  size: number;
}

export interface Conversation {
  id: string;
  participants: string[];
  // Add other properties your conversation object might have
  createdAt?: Date;
  updatedAt?: Date;
  lastMessage?: string;
  // etc.
}
