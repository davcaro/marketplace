import { User } from '../users/user.model';
import { Item } from '../items/item.model';
import { ChatMessage } from './chat-message.model';

export class Chat {
  public id: number;
  public item: Item;
  public users: { userId: number; archived: boolean; user: User }[];
  public messages: { pagination: { limit: number; offset: number; total: number }; data: ChatMessage[] };

  getOtherUser(userId: number) {
    return this.users.find(user => user.userId !== userId).user;
  }

  isArchived(userId: number): boolean {
    return this.users.find(user => user.userId === userId).archived;
  }
}
