export interface IStandardResponse {
  code: number
  data: any
  message: string
}

export interface IDataResponse<T> extends IStandardResponse {
  data: T | null
}

export interface IStandardPageModel<T> {
  items: T[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

export interface IPageResponse<T> extends IStandardResponse {
  data: IStandardPageModel<T>
}

export interface IBaseEntity {
  id?: number

  createdAt?: string
  updatedAt?: string
}
