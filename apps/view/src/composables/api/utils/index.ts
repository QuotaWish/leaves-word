import { endHttp } from '../axios'

export default {
  getWordPronounce(word: string) {
    if (!word || word.trim() === '') {
      console.error('单词为空，无法获取发音');
      return '';
    }

    try {
      // 对单词进行处理和编码
      const processedWord = word.trim().replaceAll(" ", "+");

      // 优先使用有道词典API
      const url = new URL('https://dict.youdao.com/dictvoice');
      url.searchParams.append('type', '2'); // 美式发音
      url.searchParams.append('audio', processedWord);

      // 备用TTS API (备注：不使用它，仅作为备用)
      // const fallbackUrl = `/api/tts?text=${encodeURIComponent(word.trim())}`;

      console.log(`获取单词 "${word}" 的发音`);
      return url.toString();
    } catch (error) {
      console.error(`获取单词 "${word}" 发音URL时出错:`, error);
      // 出错时使用后备方案
      return `/api/tts?text=${encodeURIComponent(word.trim())}`;
    }
  },
  getPhrasePronounce(phrase: string) {
    return fetch("https://tts.tagzxia.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer DEo1g79CuJVrunSmUhUmPhMHnRr5iZWd"
      },
      body: JSON.stringify({
        model: "tts-1",
        input: phrase,
        voice: "en-US-AndrewNeural"
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.arrayBuffer(); // 如果你需要的是音频文件内容
    });
  },
  getDailyQuote() {
    // const url = `https://dailyquote.quotawish.com/weapps/dailyquote/quote`
    const obj = Apis.userController.getDailyQuoteUsingGET()
    const url = `${obj.baseURL}${obj.url}`

    return endHttp.get(url)
  }
}
