import i18n from "../../i18n"
import NewEntityDetails from "./NewEntityDetails"
import NewEntityCredentials from "./NewEntityCredentials"
import NewEntityCreation from "./NewEntityCreation"

export enum EntityCreationSteps {
  DETAILS = 0,
  CREDENTIALS = 1,
  CREATION = 2
}

export const EntityCreationStepComponents = {
  [EntityCreationSteps.DETAILS]: {
    component: NewEntityDetails,
    stepTitle: i18n.t("entity.details"),
  },
  [EntityCreationSteps.CREDENTIALS]: {
    component: NewEntityCredentials,
    stepTitle: i18n.t("entity.credentials"),
  },
  [EntityCreationSteps.CREATION]: {
    component: NewEntityCreation,
    stepTitle: i18n.t("entity.creation"),
  }
}
