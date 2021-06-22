import i18n from "@i18n"
import { useEntityCreation } from "@hooks/entity-creation"

import { FormMetadata } from "./metadata"
import { FormCredentials } from "./credentials"
import { FormCreation } from "./creation"
import { EntityReady } from "./entity-ready"

export enum EntityCreationPageSteps {
  METADATA = 0,
  CREDENTIALS = 1,
  CREATION = 2,
  CREATED = 3
}

export const EntityCreationPageStepTitles = {
  [EntityCreationPageSteps.METADATA]: i18n.t("entity.details"),
  [EntityCreationPageSteps.CREDENTIALS]: i18n.t("entity.credentials"),
  [EntityCreationPageSteps.CREATION]: i18n.t("entity.creation"),
  [EntityCreationPageSteps.CREATED]: i18n.t("entity.created")
}

export const EntityCreationPageStep = () => {
  const { pageStep } = useEntityCreation()

  switch (pageStep) {
    case EntityCreationPageSteps.METADATA: return <FormMetadata />
    case EntityCreationPageSteps.CREDENTIALS: return <FormCredentials />
    case EntityCreationPageSteps.CREATION: return <FormCreation />
    case EntityCreationPageSteps.CREATED: return <EntityReady />
  }
  return null
}
