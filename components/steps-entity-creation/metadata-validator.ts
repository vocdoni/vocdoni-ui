import { ErrorFields, validateFields, Validation } from "@lib/validators";
import { descriptionValidator } from "@lib/validators/description-validator";
import { emailValidator } from "@lib/validators/email-validator";
import { entityNameValidator } from "@lib/validators/entity-name-validator";
import { fileValidator, IFile } from "@lib/validators/file-validator";
import { termsValidator } from "@lib/validators/terms-validator";

import { MetadataFields } from "./metadata";


interface IEntityMetadata {
  [MetadataFields.Name]: string
  [MetadataFields.Description]: string
  [MetadataFields.Email]: string
  [MetadataFields.Logo]: IFile
  [MetadataFields.Header]: IFile
}

export const entityMetadataValidator = (metadata: IEntityMetadata): ErrorFields => {
  const metadataValidation: Map<string, Validation> = new Map([
    [
      MetadataFields.Name,
      {
        argument: metadata[MetadataFields.Name],
        validator: entityNameValidator
      }
    ],
    [
      MetadataFields.Email,
      {
        argument: metadata[MetadataFields.Email],
        validator: emailValidator
      }
    ],
    [
      MetadataFields.Description,
      {
        argument: metadata[MetadataFields.Description],
        validator: descriptionValidator
      }
    ],
    [
      MetadataFields.Header,
      {
        argument: metadata[MetadataFields.Header],
        validator: fileValidator
      }
    ],
    [
      MetadataFields.Logo,
      {
        argument: metadata[MetadataFields.Logo],
        validator: fileValidator
      }
    ]
  ])

  return validateFields(metadataValidation)
}