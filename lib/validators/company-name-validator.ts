import { InvalidCompanyNameError } from "./errors/invalid-company-name-error"

const MIN_ENTITY_NAME_LENGTH = 3

export const companyNameValidator = (entityName: string) => (
  entityName.length >= MIN_ENTITY_NAME_LENGTH? null: new InvalidCompanyNameError(MIN_ENTITY_NAME_LENGTH)
)