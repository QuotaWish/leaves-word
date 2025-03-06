import { Tool } from '@langchain/core/tools'

interface BaseParameters {

  /**
   * Specify the client-side timeout of the request. In milliseconds.
   */
  timeout?: number
}

enum SearchEngine {
  BING = 'bing', Google = 'google', DuckDuckGo = 'duckduckgo', Yahoo = 'yahoo',
}

export interface QuotaSearchAPIParameters extends BaseParameters {
  /**
   * Search Query
   * Parameter defines the query you want to search. You can use anything that you
   * would use in a regular Google search. e.g. `inurl:`, `site:`, `intitle:`. We
   * also support advanced search query parameters such as as_dt and as_eq. (Like)See the
   * [full list](https://serpapi.com/advanced-google-query-parameters) of supported
   * advanced search query parameters.
   */
  query: string

  engine: SearchEngine
}

export class QuotaSearchAPI extends Tool {
  static lc_name() {
    return 'QuotaSearchAPI'
  }

  toJSON() {
    return this.toJSONNotImplemented()
  }

  protected params: Partial<QuotaSearchAPIParameters>

  constructor(
    params: Partial<QuotaSearchAPIParameters> = {},
  ) {
    super()

    this.params = params
  }

  name = 'search'

  /** @ignore */
  async _call(input: string) {
    const { timeout, ...params } = this.params

    console.log('[QuotaSearch] searching ', input)

    const res = await fetch(`https://search.tagzxia.com/search?q=${encodeURIComponent(input + params.query)}`, {
      method: 'GET',
      signal: timeout ? AbortSignal.timeout(timeout) : undefined,
    })

    const str = await res.json()

    return JSON.stringify(str)
  }

  description
    = 'a search engine. useful for when you need to answer questions about current events. input should be a search query.'
}

export class QuotaSearchImagesAPI extends Tool {
  static lc_name() {
    return 'QuotaSearchImagesAPI'
  }

  toJSON() {
    return this.toJSONNotImplemented()
  }

  protected params: Partial<QuotaSearchAPIParameters>

  constructor(
    params: Partial<QuotaSearchAPIParameters> = {},
  ) {
    super()

    this.params = params
  }

  name = 'search-images'

  /** @ignore */
  async _call(input: string) {
    const { timeout, ...params } = this.params

    console.log('[QuotaSearch] images searching ', input)

    const res = await fetch(`https://search.tagzxia.com/searchImages?q=${encodeURIComponent(input + params.query)}&max_results=5`, {
      method: 'GET',
      signal: timeout ? AbortSignal.timeout(timeout) : undefined,
    })

    const str = await res.json()

    return JSON.stringify(str)
  }

  description
    = 'a search engine. useful for when you need to answer images about relative/current/history events. input should be a search query.'
}

export class QuotaSearchVideosAPI extends Tool {
  static lc_name() {
    return 'QuotaSearchVideosAPI'
  }

  toJSON() {
    return this.toJSONNotImplemented()
  }

  protected params: Partial<QuotaSearchAPIParameters>

  constructor(
    params: Partial<QuotaSearchAPIParameters> = {},
  ) {
    super()

    this.params = params
  }

  name = 'search-videos'

  /** @ignore */
  async _call(input: string) {
    const { timeout, ...params } = this.params

    console.log('[QuotaSearch] videos searching ', input)

    const res = await fetch(`https://search.tagzxia.com/searchVideos?q=${encodeURIComponent(input + params.query)}&max_results=3`, {
      method: 'GET',
      signal: timeout ? AbortSignal.timeout(timeout) : undefined,
    })

    const str = await res.json()

    return JSON.stringify(str)
  }

  description
    = 'a search engine. useful for when you need to answer videos about relative/current/history events. input should be a search query.'
}
