export interface ISignSingleData {
  amount: number
  data: string
}

export abstract class ASigninManager {
  /**
   * 进行签到
   * @param year 如2024
   * @param month 如12月
   * @param day 如15日
   * @param uid 如1
   */
  public async sign(year: number, month: number, day: number, uid: number): Promise<ISignSingleData> {
    const signData = await this.getUserSignData(year, month, uid)

    const list = signData.split('')

    const dayIndex = day - 1

    if (list?.[dayIndex] === '1') {
      throw new Error('Already signed!')
    }

    while (list.length < dayIndex) {
      list.push('0')
    }

    list[dayIndex] = '1'

    const amo = this.calcAccumuData(signData)

    await this.saveUserSignData(year, month, uid, list.join(''))

    return {
      amount: amo,
      data: list.join(''),
    }
  }

  public abstract getUserSignData(year: number, month: number, uid: number): Promise<string>
  public abstract saveUserSignData(year: number, month: number, uid: number, data: string): Promise<boolean>

  // /**
  //  * 获取用户历史累计签到 有6h的强缓存
  //  * 每次签到都会更新缓存
  //  */
  // public async getUserHistoryAccumulatedSignDays(uid: number) {

  // }

  /**
   * 获取某一年的用户连续签到数量
   * @param year 如2024
   */
  public async getUserAccumulatedSignDaysInYear(year: number, uid: number): Promise<{
    total: number
    list: ISignSingleData[]
  }> {
    const list = new Array<ISignSingleData>()
    let accu = 0

    for (let i = 0; i < 12; ++i) {
      const res = await this.getUserAccumulatedSignDays(year, i + 1, uid)

      accu += res.amount
      list.push(res)
    }

    return {
      total: accu,
      list,
    }
  }

  /**
   * 获取某个月的用户连续签到数量
   * @param year 如2024
   * @param month 如12月
   */
  public async getUserAccumulatedSignDays(year: number, month: number, uid: number): Promise<ISignSingleData> {
    const signData = await this.getUserSignData(year, month, uid)

    const amo = this.calcAccumuData(signData)

    return {
      amount: amo,
      data: signData,
    }
  }

  public calcAccumuData(signData: string): number {
    let num = (signData) || ''
    let amo = 0

    while (num.length) {
      if (((+num.at(-1) || 0) & 1) === 0)
        break

      num = num.slice(0, -1)
      amo++
    }

    return amo
  }
}
