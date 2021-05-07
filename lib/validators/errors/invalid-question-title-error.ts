import i18n from "@i18n";

export class InvalidQuestionTitleError extends Error  {
  constructor(length: number) {
    super(i18n.t('error.invalid_question_title', {length}))
  }
}