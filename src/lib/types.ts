export type ToastTypes = 'success' | 'error'

export type ToastMessage = {
  type: ToastTypes
  message: string
}

export type Session = {
  id: string
}
