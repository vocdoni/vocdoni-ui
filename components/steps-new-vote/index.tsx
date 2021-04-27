import { useProcessCreation } from "../../hooks/process-creation"
import i18n from "../../i18n"
import { FormMetadata } from "./metadata"
import { FormCensus } from "./census"
import { FormOptions } from "./options"
import { FormCreation } from "./creation"
import { ProcessReady } from "./process-ready"
// import NewVoteGeneral from "./NewVoteGeneral"
// import NewProcessCreation from "./NewProcessCreation"

export enum ProcessCreationPageSteps {
  METADATA = 0,
  CENSUS = 1,
  OPTIONS = 2,
  CREATION = 3,
  READY = 4
}

export const ProcessCreationPageStepTitles = {
  [ProcessCreationPageSteps.METADATA]: i18n.t("vote.details"),
  [ProcessCreationPageSteps.CENSUS]: i18n.t("vote.who_can_vote"),
  [ProcessCreationPageSteps.OPTIONS]: i18n.t("vote.options"),
  [ProcessCreationPageSteps.CREATION]: i18n.t("vote.creation"),
  [ProcessCreationPageSteps.READY]: i18n.t("vote.your_process_is_ready"),
}

export const ProcessCreationPageStep = () => {
  const { pageStep } = useProcessCreation()

  switch (pageStep) {
    case ProcessCreationPageSteps.METADATA: return <FormMetadata />
    case ProcessCreationPageSteps.CENSUS: return <FormCensus />
    case ProcessCreationPageSteps.OPTIONS: return <FormOptions />
    case ProcessCreationPageSteps.CREATION: return <FormCreation />
    case ProcessCreationPageSteps.READY: return <ProcessReady />
  }
  return null
}
