import { useVoteCreation } from "../../hooks/vote-creation"
import i18n from "../../i18n"
import { FormMetadata } from "./metadata"
// import NewVoteCensus from "./NewVoteCensus"
// import NewVoteGeneral from "./NewVoteGeneral"
// import NewVoteCreation from "./NewVoteCreation"

export enum VoteCreationPageSteps {
  METADATA = 0,
  CENSUS = 1,
  GENERAL = 2,
  CREATION = 3
}

export const VoteCreationPageStepTitles = {
  [VoteCreationPageSteps.METADATA]: i18n.t("vote.details"),
  [VoteCreationPageSteps.CENSUS]: i18n.t("vote.who_can_vote"),
  [VoteCreationPageSteps.GENERAL]: i18n.t("vote.general"),
  [VoteCreationPageSteps.CREATION]: i18n.t("vote.creation"),
}

export const VoteCreationPageStep = () => {
  const { pageStep } = useVoteCreation()

  switch (pageStep) {
    case VoteCreationPageSteps.METADATA: return <FormMetadata />
    case VoteCreationPageSteps.CENSUS: return null // <VoteCreationCredentials />
    case VoteCreationPageSteps.GENERAL: return null // <VoteCreationCredentials />
    case VoteCreationPageSteps.CREATION: return null // <VoteCreationCreation />
  }
  return null
}
