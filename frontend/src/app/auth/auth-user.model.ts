export class AuthUser {
  constructor(
    public idutente: string,
    public idutcas: string,
    public nomecognome: string, // nome e cognome
    public username: string,
    public idcommessa: string,
    public commessa: string,
    public autorizzazione: string,

    public btnStream: number,
    public btnCpt: number,
    public btnGall: number,
    public btnGallDel: number,
    public btnGallUpdate: number,
    public btnGallDownload: number,
    public btnInsMkr: number,
    public btnDelMkr: number,
    public btnGpsOn: number,
    public btnBkoff: number,
    public btnRooms: number,
    public btnBoard: number,

    private _token: string,
    public tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}
