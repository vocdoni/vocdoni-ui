import { Choice, Question } from '@lib/types'
import { choiceValidator } from './choice-validator'
import { descriptionValidator } from './description-validator'
import {
  MapQuestionError,
  InvalidQuestionsError,
  QuestionError,
} from './errors/invalid-question-error'
import { titleValidator } from './title-validator'

const validateQuestion = (question: Question): QuestionError => {
  const questionError: QuestionError = {}
  let hasInvalidChoice = false
  questionError.title = titleValidator(question.title.default)
  questionError.description = descriptionValidator(question.description.default)

  questionError.choices = question.choices.map((choice: Choice) => {
    const errorChoice = choiceValidator(choice.title.default)

    if(errorChoice) {
      hasInvalidChoice = true
      return errorChoice
    }
  })

  return hasInvalidChoice || questionError.title || questionError.description? questionError: null
}

export const questionsValidator = (
  questions: Question[]
): InvalidQuestionsError => {
  const questionErrors: MapQuestionError = new Map()

  for (let index in questions) {
    const errorQuestion = validateQuestion(questions[index])

    if (errorQuestion) {
      questionErrors.set(parseInt(index), errorQuestion)
    }
  }

  return questionErrors.size ? new InvalidQuestionsError(questionErrors) : null
}
