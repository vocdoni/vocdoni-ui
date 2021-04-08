import i18n from "../../i18n"
import EntityCreationMetadata from "./metadata"
import EntityCreationCredentials from "./credentials"
import EntityCreationCreation from "./creation"

export enum EntityCreationSteps {
  METADATA = 0,
  CREDENTIALS = 1,
  CREATION = 2
}

export const EntityCreationStepComponents = {
  [EntityCreationSteps.METADATA]: {
    component: EntityCreationMetadata,
    stepTitle: i18n.t("entity.details"),
  },
  [EntityCreationSteps.CREDENTIALS]: {
    component: EntityCreationCredentials,
    stepTitle: i18n.t("entity.credentials"),
  },
  [EntityCreationSteps.CREATION]: {
    component: EntityCreationCreation,
    stepTitle: i18n.t("entity.creation"),
  }
}
