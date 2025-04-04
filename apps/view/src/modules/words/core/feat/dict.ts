export interface IDict {
  id: string
  name: string
  type: 'English'
  style: {
    color: string
    colorLight: string
    icon: string
  }
  words: IWord[]
  storage: DictStorage
}

export class Dictionary implements IDict {
  id: string
  name: string
  type: 'English'
  style: {
    color: string
    colorLight: string
    icon: string
  }

  words: IWord[]
  storage: DictStorage

  constructor(id: string, name: string, words: IWord[], style: IDict['style']) {
    this.id = id
    this.name = name
    this.type = 'English'
    this.style = style
    this.words = words

    this.storage = new DictStorage(this)
  }
}