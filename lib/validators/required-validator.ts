import { RequiredError } from "./errors/required-error"

export const requiredValidator = (value: string) => {
  return !value || value.length === 0 ? new RequiredError() : null
}
