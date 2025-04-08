export abstract class Statistics<T extends Record<string, any>> {
  startTime: number
  endTime: number
  cost: number
  data: T

  constructor(startTime: number, endTime: number, cost: number, data: T) {
    this.startTime = startTime
    this.endTime = endTime
    this.cost = cost
    this.data = data
  }

  addData<K extends keyof T>(data: K, value: T[K]): void {
    this.data[data] = value
  }

  removeData(data: keyof T): void {
    delete this.data[data]
  }

  clearData(): void {
    this.data = {} as T
  }

  getStatistics(): T {
    return this.data
  }

  getData<K extends keyof T>(data: K): T[K] | undefined {
    if (data in this.data) {
      return this.data[data]
    }

    return undefined
  }

  getDataDefault<K extends keyof T, D extends T[K]>(data: K, defaultValue: D): NonNullable<T[K] | D> {
    return this.data[data] ?? defaultValue
  }

  getCost(): number {
    return this.endTime - this.startTime
  }

  getCostString(): string {
    const hours = Math.floor(this.cost / 3600)
    const minutes = Math.floor((this.cost % 3600) / 60)
    const seconds = this.cost % 60
    return `${hours}:${minutes}:${seconds}`
  }

  abstract getDisplayComponent(): Component
}
