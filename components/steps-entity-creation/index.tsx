import i18n from "../../i18n"
import { FormMetadata } from "./metadata"
import { FormCredentials } from "./credentials"
import { FormCreation } from "./creation"
import { useEntityCreation } from "../../hooks/entity-creation"

export enum EntityCreationSteps {
  METADATA = 0,
  CREDENTIALS = 1,
  CREATION = 2
}

export const EntityCreationStepTitles = {
  [EntityCreationSteps.METADATA]: i18n.t("entity.details"),
  [EntityCreationSteps.CREDENTIALS]: i18n.t("entity.credentials"),
  [EntityCreationSteps.CREATION]: i18n.t("entity.creation"),
}

export const EntityCreationStep = () => {
  const { step } = useEntityCreation()

  switch (step) {
    case EntityCreationSteps.METADATA: return <FormMetadata />
    case EntityCreationSteps.CREDENTIALS: return <FormCredentials />
    case EntityCreationSteps.CREATION: return <FormCreation />
  }
  return null
}
