import { validateFields, Validation } from "@lib/validators"
import { descriptionValidator } from "@lib/validators/description-validator"
import { emailValidator } from "@lib/validators/email-validator"
import { entityNameValidator } from "@lib/validators/entity-name-validator"
import { EntityFields, IEntityData } from "."

export const entityDataValidator = (data: IEntityData) => {
  const dataValidator: Map<EntityFields, Validation>  = new Map([
    [
      EntityFields.Name,
      {
        argument: data.metadata.name.default,
        validator: entityNameValidator
      }
    ], [
      EntityFields.Email,
      {
        argument: data.registryData.email,
        validator: emailValidator
      }
    ], [
      EntityFields.Description,
      {
        argument: data.metadata.description.default,
        validator: descriptionValidator
      }
    ]
  ])

  return validateFields(dataValidator)
}