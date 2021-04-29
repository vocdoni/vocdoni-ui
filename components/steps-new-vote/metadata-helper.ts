import { ProcessMetadata } from 'dvote-js'
import { PlazaMetadataKeys } from '../../const/metadata-keys'

import { MetadataFields } from './metadata'
import { IChoice, IQuestion } from './question-group'

const MIN_CHOICE_LENGTH = 1
const MIN_TITLE_LENGTH = 4
const MIN_DESCRIPTION_LENGTH = 10

const linkRegexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

const titleValidator = (title: string): boolean =>
  title.length >= MIN_TITLE_LENGTH

const descriptionValidator = (description: string): boolean =>
  description.length >= MIN_DESCRIPTION_LENGTH

const linkValidator = (link: string): boolean => linkRegexp.test(link)

const optionalLinkValidator = (link: string): boolean => (!link) ? true : linkRegexp.test(link)

const choiceValidator = (choice: IChoice): boolean =>
  choice.title.default.length >= MIN_CHOICE_LENGTH && choice.value !== undefined

const questionValidator = (questions: IQuestion[]): boolean => {
  const validateQuestion = (question: IQuestion) => {
    const questionIsValid =
      question.title.default.length >= MIN_TITLE_LENGTH

    // Note: the question description is not needed

    const invalidChoices = question.choices.filter(
      (choice: IChoice) => !choiceValidator(choice)
    )

    return questionIsValid && invalidChoices.length === 0
  }

  for (let iterateQuestion of questions) {
    // Guard non create questions
    if (
      !iterateQuestion.title ||
      !iterateQuestion.description ||
      !iterateQuestion.choices
    ) {
      return false
    }

    if (!validateQuestion(iterateQuestion)) {
      return false
    }
  }

  return true
}

export type ErrorFields = Map<string, string>

interface IValidation {
  argument: any
  validator: (arg) => boolean
}

const validateFields = (validations: Map<string, IValidation>): ErrorFields => {
  let errorFields: ErrorFields = new Map()

  validations.forEach((validation: IValidation, key: string) => {
    if (!validation.validator(validation.argument)) {
      errorFields.set(key, 'Field invalid')
    }
  })

  return errorFields
}

export const createEmptyOption = (value: number): IChoice => ({
  title: {
    default: '',
  },
  value: value,
})

export const createEmptyQuestion = (): IQuestion => ({
  title: {
    default: '',
  },
  description: {
    default: '',
  },
  choices: [createEmptyOption(0), createEmptyOption(1)],
})

export const validateMetadata = (metadata: ProcessMetadata): ErrorFields => {
  const metadataValidation: Map<string, IValidation> = new Map([
    [
      MetadataFields.Title,
      {
        argument: metadata.title.default,
        validator: titleValidator,
      },
    ],
    [
      MetadataFields.Description,
      {
        argument: metadata.description.default,
        validator: descriptionValidator,
      },
    ],
    [
      MetadataFields.StreamLink,
      {
        argument: metadata.media?.streamUri,
        validator: optionalLinkValidator,
      },
    ],
    [
      MetadataFields.AttachmentLink,
      {
        argument: metadata.meta[PlazaMetadataKeys.ATTACHMENT_URI],
        validator: optionalLinkValidator,
      },
    ],
    [
      MetadataFields.DiscussionLink,
      {
        argument: metadata.meta[PlazaMetadataKeys.DISCUSSION_URL],
        validator: optionalLinkValidator,
      },
    ],
    [
      MetadataFields.Question,
      {
        argument: metadata.questions,
        validator: questionValidator,
      },
    ],
  ])

  return validateFields(metadataValidation)
}
