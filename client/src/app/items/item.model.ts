import { Location } from '../shared/location.model';
import { format } from 'date-fns';

export class Item {
  public id: number;
  public title: string;
  public description: string;
  public price: number;
  public location: Location;
  public status: string;
  public condition: string;
  public createdAt: string;
  public updatedAt: string;
  public favorites: number;
  public views: number;
  public user: { id: number; name: string; avatar: string };
  public category: { id: number; name: string; icon: string };
  public images: { id: number; image: string }[];

  get creationDate() {
    return format(new Date(this.createdAt), 'dd/MM/yyyy');
  }

  get updatedDate() {
    return format(new Date(this.updatedAt), 'dd/MM/yyyy');
  }
}
