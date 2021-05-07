import i18n from '@i18n'

export type QuestionError = {
  title?: Error
  description?: Error
  choices?: Error[]
}

export type MapQuestionError = Map<number, QuestionError>

export class InvalidQuestionsError extends Error {
  public question: MapQuestionError

  constructor(question: MapQuestionError) {
    super(i18n.t('error.invalid_question_error'))

    this.question = question
  }
}
