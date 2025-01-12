export type ToastTypes = 'success' | 'error'

export type ToastMessage = {
  type: ToastTypes
  message: string
}

export type UserSession = {
  id: string
  name: string
}

export type CountdownData = {
  hours: number
  minutes: number
  seconds: number
  done: boolean
}
