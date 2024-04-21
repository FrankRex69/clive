export class RoomUser {
  constructor(
    public idutente: string,
    public nome: string,
    public stream: boolean,
    public audioOn?: boolean,
    public micOn?: boolean,
    public audioStream?: MediaStream
  ) {}

  get initials(): string {
    if(this.nome){
      let name = this.nome.split(' ');
      let initials = name[0].charAt(0) + name[name.length - 1].charAt(0);
      return initials;
    } else {
      return '';
    }
  }
}
