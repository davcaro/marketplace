import { format } from 'date-fns';
import { User } from '../users/user.model';
import { Item } from '../items/item.model';

export class Review {
  public id: number;
  public item: Item;
  public fromUserId: number;
  public fromUser: User;
  public toUserId: number;
  public toUser: User;
  public score: number;
  public description: string;
  public updatedAt: string | Date;

  get user(): User {
    return this.fromUser || this.toUser;
  }

  get date(): string {
    return format(new Date(this.updatedAt), 'dd/MM/yyyy');
  }

  get isAPurchase(): boolean {
    return this.toUserId === this.item.user.id;
  }
}
