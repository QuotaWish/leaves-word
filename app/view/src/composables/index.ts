export * from './dark'

export async function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

export async function useRequestAnimationFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

export function formateType(type: string[], len: number = -1) {
  let types = type.map((item) => {
    return item.replace(/[^a-z]/gi, '')
  })

  if (len !== -1) {
    types = types.splice(0, len)
  }

  return types.join('/')
}

export function replaceKeywords(keyword: string, text: string, as: string) {
  return text.replaceAll(new RegExp(`${keyword}`, 'g'), as)
}

export function highlightKeywords(text: string, keyword: string) {
  const template = (k: string) => `<span class="highlight">${k}</span>`

  // 将关键词短语划分
  const keywords = keyword.split(' ')
  let finalText = replaceKeywords(keyword, text, `<span class="highlight">${keyword}</span>`)
  let index = -1

  keywords.forEach((item) => {
    const ind = text.indexOf(item, index)

    if (ind !== -1) {
      index = ind
      finalText = replaceKeywords(item, finalText, template(item))
    }
  })

  return finalText
}

export function useVibrate(type: 'light' | 'heavy' | 'medium' | 'bit') {
  switch (type) {
    case 'light':
      useAutoVibrate([5])
      break
    case 'heavy':
      useAutoVibrate([5, 30])
      break
    case 'medium':
      useAutoVibrate([10, 15])
      break
    case 'bit':
      useAutoVibrate([2, 1])
      break
  }
}

export function useAutoVibrate(duration: number[]) {
  if (typeof window !== 'undefined' && window.navigator.vibrate)
    window.navigator.vibrate(duration)
}
