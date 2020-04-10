export class Article {
  public id: number;
  public title: string;
  public description: string;
  public price: number;
  public location: string;
  public status: string;
  public condition: string;
  public createdAt: string;
  public user: { id: number; name: string; avatar: string };
  public category: { id: number; name: string; icon: string };
  public images: { id: number; image: string }[];

  get creationDate() {
    return new Date(this.createdAt).toLocaleDateString('es-ES');
  }
}
