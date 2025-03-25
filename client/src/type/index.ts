interface Message {
    sender: string; // ObjectId of the sender
    content: string; // Message content
    timestamp: string; // Timestamp of the message
  }
  
 export interface Conversation {
    _id: string; 
    participants: string[]; 
    messages: Message[];
    createdAt: string; 
    updatedAt: string; 
  }