import { Dictionary } from '../../../modules/words/core/types'
import Cet6 from './cet6.json?raw'

const dictionary = new Dictionary('CET-6', '六级过考词汇', JSON.parse(Cet6), {
  color: '#F07A67FF',
  colorLight: '#BC4232FF',
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M18 14h-4v-3h5V9h-5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2m-4 7v-5h4v5Z"/></svg>',
})

export default dictionary
