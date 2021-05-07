import { InvalidTitleError } from "./errors/invalid-title-error"

const MIN_TITLE_LENGTH = 3

export const titleValidator = (questionTitle: string) => (
  questionTitle.length >= MIN_TITLE_LENGTH? null: new InvalidTitleError(MIN_TITLE_LENGTH)
)