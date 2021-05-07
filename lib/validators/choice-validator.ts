import { InvalidChoiceError } from "./errors/invalid-choice-error"

const MIN_CHOICE_LENGTH = 1

export const choiceValidator = (questionTitle: string) => (
  questionTitle.length >= MIN_CHOICE_LENGTH? null: new InvalidChoiceError(MIN_CHOICE_LENGTH)
)