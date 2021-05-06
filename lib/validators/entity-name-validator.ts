import { InvalidEntityNameError } from "./errors/invalid-entity-name-error"

const MIN_ENTITY_NAME_LENGTH = 3

export const entityNameValidator = (entityName: string) => (
  entityName.length >= MIN_ENTITY_NAME_LENGTH? null: new InvalidEntityNameError(MIN_ENTITY_NAME_LENGTH)
)