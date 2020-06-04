import { Location } from '../shared/location.model';

export class User {
  public score: { score: number; reviews: number };

  constructor(
    public id: number,
    public email: string,
    public name: string,
    public avatar: string,
    public location: Location,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }

    return this._token;
  }
}
