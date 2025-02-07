import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { isDate } from 'lodash'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('zh-cn')

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'

export function formatToDateTime(
  date: string | number | Date | dayjs.Dayjs | null | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format)
}

export function formatToDate(
  date: string | number | Date | dayjs.Dayjs | null | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format)
}

export function isDateObject(obj: unknown): boolean {
  return isDate(obj) || dayjs.isDayjs(obj)
}

// wechat format time
export function genRFCTime(timestamp?: number) {
  return dayjs(timestamp || Date.now()).tz('Asia/Shanghai').format('YYYY-MM-DDTHH:mm:ssZ')
}
