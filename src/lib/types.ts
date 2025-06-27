export type ToastTypes = 'success' | 'error'

export type ToastMessage = {
  type: ToastTypes
  message: string
}

export type UserSession = {
  id: string
  name: string
  email: string
  picture: string
  currencyCode: string
}

export type CountdownData = {
  hours: number
  minutes: number
  seconds: number
  done: boolean
}
