import type { EnglishDictionary } from '~/composables/api/clients/globals';
import { LeafDictStorage } from './storage'

export class LeafDict implements EnglishDictionary {
  approved_words?: number;
  author?: string;
  create_time?: string;
  description?: string;
  id?: number;
  image_url?: string;
  is_delete?: number
  isbn?: string
  name?: string
  publication_date?: string
  published_words?: number
  publisher?: string
  total_words?: number
  update_time?: string

  storage: LeafDictStorage

  constructor(dict: EnglishDictionary) {
    Object.assign(this, dict)

    this.storage = new LeafDictStorage(this)
  }
}

// export const dictionaries = reactive<IDict[]>([
//   high,
//   cet4,
//   cet6,
//   postGraduate,
//   ielts,
// ])
