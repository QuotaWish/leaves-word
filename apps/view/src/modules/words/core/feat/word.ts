export interface IWordData {
  word: string
  learnedTime: number
}

export class LeafWordData {
  word: string
  learnedTime: number

  constructor(word: string) {
    this.word = word
    this.learnedTime = Date.now()
  }
}
