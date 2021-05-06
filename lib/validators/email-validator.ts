import { InvalidEmailError } from './errors/invalid-email-error'

const emailRegexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

export const emailValidator = (email: string): Error | null => (
  emailRegexp.test(email)? null: new InvalidEmailError
)