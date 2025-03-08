import { Tool } from '@langchain/core/tools'

export class QuotaDateAPI extends Tool {
  static lc_name() {
    return 'QuotaDateAPI'
  }

  toJSON() {
    return this.toJSONNotImplemented()
  }

  constructor(
  ) {
    super()
  }

  name = 'date'

  /** @ignore */
  async _call() {
    return JSON.stringify({
      now: Date.now(),
      date: new Date().toISOString(),
      time: new Date().toTimeString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      utc: new Date().toUTCString(),
      utcOffset: new Date().getTimezoneOffset(),
      day_of_week: new Date().getDay(),
    })
  }

  description
    = 'a date source. useful for when you need to answer questions about current/relative date. will return a now date.'
}
