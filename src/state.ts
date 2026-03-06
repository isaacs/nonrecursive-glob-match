export class State {
  str: string
  pos: number
  length: number
  constructor(str: string) {
    this.str = str
    this.pos = 0
    this.length = str.length
  }
}
