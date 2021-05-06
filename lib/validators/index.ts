export type ErrorFields = Map<string, Error>
export type DirtyFields = Map<string, boolean>

export type Validation = {
  argument: any
  validator: (arg) => Error | null
}

export const validateFields = (validations: Map<string, Validation>): ErrorFields => {
  let errorFields: ErrorFields = new Map()

  validations.forEach((validation: Validation, key: string) => {
    const fieldError: Error = validation.validator(validation.argument)

    if (fieldError) {
      errorFields.set(key, fieldError)
    }
  })

  return errorFields
}
