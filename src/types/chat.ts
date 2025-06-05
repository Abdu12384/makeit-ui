export interface Chat {
  _id: string;
  senderId: string;
  chatId: string;
  senderModel: "client" | "vendors";
  receiverId: string;
  receiverModel: "client" | "vendors";
  lastMessage: string;
  lastMessageAt: string;
}

export interface Message {
  chatId: string;
  senderId: string;
  senderModel: "client" | "vendors";
  messageContent: string;
  sendedTime: string;
  seen: boolean;
}


export interface User {
  userId: string;
  userModel: "client" | "vendors";
}