import { Dictionary } from '../../../modules/words/core/types'
import Cet4 from './cet4.json?raw'

const dictionary = new Dictionary('CET-4', '四级过考词汇', JSON.parse(Cet4), {
  color: '#2FD188FF',
  colorLight: '#0BA54BFF',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M18 10v8zm1-1h-2v8h-3V9h-2v10h5v4h2v-4h1v-2h-1z"/></svg>',
})

export default dictionary
