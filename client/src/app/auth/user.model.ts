export class User {
  constructor(
    public _id: number,
    public email: string,
    public name: string,
    public avatar: string,
    public location: string,
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
