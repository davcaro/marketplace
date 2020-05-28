import { Item } from 'src/app/items/item.model';

export class Notification {
  public id: number;
  public type: string;
  public toUser: { id: number; name: string; avatar: string };
  public fromUser: { id: number; name: string; avatar: string };
  public item: Item;
}

export class NotificationGroup {
  public type: string;
  public count: number;
  public icon: string;
  public url: any[];
  public title: string;
  public description: string;
}
