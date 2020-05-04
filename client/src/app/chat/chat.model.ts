import { Item } from '../items/item.model';
import { ChatMessage } from './chat-message.model';

export class Chat {
  public id: number;
  public item: Item;
  public users: { userId: number; archived: boolean }[];
  public messages?: ChatMessage[];

  get user() {
    return this.item.user;
  }

  isArchived(userId: number): boolean {
    return this.users.find(user => user.userId === userId).archived;
  }
}
