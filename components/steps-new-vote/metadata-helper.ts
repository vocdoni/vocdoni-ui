import { ProcessMetadata } from 'dvote-js'

import { MetadataFields } from './metadata'
import { IChoice, IQuestion } from './question-group'

const MIN_TITLE_LENGTH = 4
const MIN_DESCRIPTION_LENGTH = 40

const linkRegexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

const titleValidator = (title: string): boolean =>
  title.length >= MIN_TITLE_LENGTH

const descriptionValidator = (description: string): boolean =>
  description.length >= MIN_DESCRIPTION_LENGTH

const linkValidator = (link: string): boolean => linkRegexp.test(link)

const choiceValidator = (choice: IChoice): boolean =>
  choice.title.default.length >= MIN_TITLE_LENGTH && choice.value !== undefined

const questionValidator = (question: IQuestion): boolean => {
  // Guard non create questions
  if (!question.title || !question.description || !question.choices) {
    return false
  }

  const questionIsValid = question.title.default.length >= MIN_TITLE_LENGTH || question.description.default.length >= MIN_DESCRIPTION_LENGTH
  const invalidChoices = question.choices.filter((choice: IChoice) => !choiceValidator(choice))
  
  return !questionIsValid || invalidChoices.length > 0
}

type ErrorFields = Map<string, string>

interface IValidation {
  argument: any
  validator: (arg) => boolean
}

const validateFields = (
  validations: Map<string, IValidation>
): ErrorFields => {
  let errorFields: ErrorFields  = new Map();

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
        argument: metadata.title,
        validator: titleValidator,
      },
    ],
    [
      MetadataFields.Description,
      {
        argument: metadata.description,
        validator: descriptionValidator,
      },
    ],
    [
      MetadataFields.PdfLink,
      {
        argument: metadata.media[MetadataFields.PdfLink],
        validator: linkValidator,
      },
    ],
    [
      MetadataFields.ForumLink,
      {
        argument: metadata.media[MetadataFields.PdfLink],
        validator: linkValidator,
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
