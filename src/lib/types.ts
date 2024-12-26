export type ToastTypes = 'success' | 'error'

export type ToastMessage = {
  type: ToastTypes
  message: string
}

export type UserSession = {
  id: string
  email: string,
  name: string
}
