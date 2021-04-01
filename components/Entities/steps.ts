import i18n from "../../i18n"
import NewEntityCreation from "./NewEntityCreation"
import NewEntityDetails from "./NewEntityDetails"
import NewEntityCredentials from "./NewEntityCredentials"

export const NewEntitySteps = {
  NewEntityDetails: {
    component: NewEntityDetails,
    step: i18n.t("entity.details"),
  },
  NewEntityCredentials: {
    component: NewEntityCredentials,
    step: i18n.t("entity.credentials"),
  },
  NewEntityCreation: {
    component: NewEntityCreation,
    step: i18n.t("entity.creation"),
  }
}

export type INewEntitySteps = keyof typeof NewEntitySteps
