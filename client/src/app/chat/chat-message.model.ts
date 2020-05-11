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
    return new Date(this.createdAt).toLocaleDateString();
  }

  get time() {
    const date = new Date(this.createdAt);

    return `${date.getHours()}:${date.getMinutes()}`;
  }
}
