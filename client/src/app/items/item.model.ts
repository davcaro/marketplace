import { Location } from '../shared/location.model';

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
    return new Date(this.createdAt).toLocaleDateString('es-ES');
  }

  get updatedDate() {
    return new Date(this.updatedAt).toLocaleDateString('es-ES');
  }
}
