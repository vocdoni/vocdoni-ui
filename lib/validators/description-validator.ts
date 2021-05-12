import { InvalidDescriptionError } from "./errors/invalid-description-error"

const MIN_DESCRIPTION_LENGTH = 0

export const descriptionValidator = (description: string): Error | null => (
  description.length >= MIN_DESCRIPTION_LENGTH? null: new InvalidDescriptionError(MIN_DESCRIPTION_LENGTH)
)
