
import type { MovementType } from '../types'

export interface LoginErrors {
  email?: string
  password?: string
}

export function validateLogin(values: { email: string; password: string }): LoginErrors {
  const errors: LoginErrors = {}
  const email = values.email.trim()

  if (!email) errors.email = 'Email is required.'
  else if (email.length > 120) errors.email = 'Email must be at most 120 characters.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'

  const password = values.password
  if (!password) errors.password = 'Password is required.'
  else if (password.length < 8 || password.length > 64)
    errors.password = 'Password must be 8 to 64 characters.'
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
    errors.password = 'Password needs at least one letter and one digit.'

  return errors
}


export interface MovementFormValues {
  productId: number | null
  type: MovementType
  quantity: number | '' 
  reason: string
  note: string
}

export interface MovementErrors {
  productId?: string
  quantity?: string
  reason?: string
  note?: string
}


export function validateMovement(
  values: MovementFormValues,
  availableStock: number | null,
): MovementErrors {
  const errors: MovementErrors = {}

  if (values.productId === null) errors.productId = 'Please choose a product.'

  if (values.quantity === '') {
    errors.quantity = 'Quantity is required.'
  } else if (!Number.isInteger(values.quantity)) {
    errors.quantity = 'Quantity must be a whole number.'
  } else if (values.quantity < 1) {
    errors.quantity = 'Quantity must be at least 1.'
  } else if (
    values.type === 'STOCK_OUT' &&
    availableStock !== null &&
    values.quantity > availableStock
  ) {
    errors.quantity = `Cannot remove more than the available stock (${availableStock}).`
  }

  if (!values.reason) errors.reason = 'Please choose a reason.'
  if (values.note.length > 200) errors.note = 'Note must be at most 200 characters.'

  return errors
}