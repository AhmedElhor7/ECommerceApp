
/*
@description: User model
*/
export class User {
  constructor(
    public email: string,
    public name: string,
    public role: string,
    private _token: string
  ) {}
  get token() {
    return this._token;
  }
}

