import { ModeType } from '../enums'

export interface IGlobalPreference {
  dict: string
  mode: ModeType
  amount: number
}

export const obj: IGlobalPreference = {
  dict: 'CET-4',
  mode: ModeType.COMPREHENSIVE,
  amount: 10,
}

export const globalPreference = useLocalStorage<IGlobalPreference>('global-preference', JSON.parse(JSON.stringify(obj)))
