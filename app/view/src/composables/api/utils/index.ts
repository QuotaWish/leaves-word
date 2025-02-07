import { endHttp } from '../axios'

export default {
  getWordPronounce(word: string) {
    const url = new URL('https://dict.youdao.com/dictvoice')
    url.searchParams.append('type', '2')
    url.searchParams.append('audio', encodeURIComponent(word.trim()))
    // const url = `?type=2&audio=Hiding`
    // const url = `https://api.quotawish.com/api/aigc/pronounce/word/${word}`

    return url.toString()
  },
  getDailyQuote() {
    const url = `https://dailyquote.quotawish.com/weapps/dailyquote/quote`

    return endHttp.get(url)
  }
}
