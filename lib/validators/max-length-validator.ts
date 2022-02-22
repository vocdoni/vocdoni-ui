import { MaxLengthError } from "./errors/max-length-error"

export const maxLengthValidator = (value: string, length: number) => {
  return value.length > length ? new MaxLengthError(length) : null
}
