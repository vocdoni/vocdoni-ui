import { MinLengthError } from "./errors/min-length-error"

export const minLengthValidator = (value: string, length: number) => {
  return value.length < length ? new MinLengthError(length) : null
}
