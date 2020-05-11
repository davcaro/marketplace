import { format } from 'date-fns';

export class ChatMessage {
  public id: number;
  public userId: number;
  public message: string;
  public readAt: string | Date;
  public createdAt: string | Date;

  constructor(userId?: number, message?: string, readAt: string | Date = new Date()) {
    this.userId = userId;
    this.message = message;
    this.readAt = readAt;
    this.createdAt = new Date();
  }

  get date() {
    return format(new Date(this.createdAt), 'dd/MM/yyyy');
  }

  get time() {
    return format(new Date(this.createdAt), 'HH:mm');
  }
}
