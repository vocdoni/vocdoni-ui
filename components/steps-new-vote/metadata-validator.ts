import { ProcessMetadata } from 'dvote-js'

import { PlazaMetadataKeys } from '@const/metadata-keys'

import { ErrorFields, Validation, validateFields } from '@lib/validators'
import { descriptionValidator } from '@lib/validators/description-validator'
import { optionalUrlValidator } from '@lib/validators/url-validator'
import { questionsValidator } from '@lib/validators/questions-validator'
import { titleValidator } from '@lib/validators/title-validator'

import { MetadataFields } from './metadata'

export const validateMetadata = (metadata: ProcessMetadata): ErrorFields => {
  const metadataValidation: Map<MetadataFields, Validation> = new Map([
    [
      MetadataFields.Title,
      {
        argument: metadata?.title.default,
        validator: titleValidator,
      },
    ],
    [
      MetadataFields.Description,
      {
        argument: metadata?.description.default,
        validator: descriptionValidator,
      },
    ],
    [
      MetadataFields.StreamLink,
      {
        argument: metadata?.media?.streamUri,
        validator: optionalUrlValidator,
      },
    ],
    [
      MetadataFields.AttachmentLink,
      {
        argument: metadata?.meta[PlazaMetadataKeys.ATTACHMENT_URI],
        validator: optionalUrlValidator,
      },
    ],
    [
      MetadataFields.DiscussionLink,
      {
        argument: metadata?.meta[PlazaMetadataKeys.DISCUSSION_URL],
        validator: optionalUrlValidator,
      },
    ],
    [
      MetadataFields.Question,
      {
        argument: metadata?.questions,
        validator: questionsValidator,
      },
    ],
  ])

  return validateFields(metadataValidation)
}
