import { useVoteCreation } from "../../hooks/vote-creation"
import i18n from "../../i18n"
import { FormMetadata } from "./metadata"
// import NewVoteCensus from "./NewVoteCensus"
// import NewVoteGeneral from "./NewVoteGeneral"
// import NewVoteCreation from "./NewVoteCreation"

export enum VoteCreationSteps {
  METADATA = 0,
  CENSUS = 1,
  GENERAL = 2,
  CREATION = 3
}

export const VoteCreationStepTitles = {
  [VoteCreationSteps.METADATA]: i18n.t("vote.details"),
  [VoteCreationSteps.CENSUS]: i18n.t("vote.who_can_vote"),
  [VoteCreationSteps.GENERAL]: i18n.t("vote.general"),
  [VoteCreationSteps.CREATION]: i18n.t("vote.creation"),
}

export const VoteCreationStep = () => {
  const { pageStep } = useVoteCreation()

  switch (pageStep) {
    case VoteCreationSteps.METADATA: return <FormMetadata />
    case VoteCreationSteps.CENSUS: return null // <VoteCreationCredentials />
    case VoteCreationSteps.GENERAL: return null // <VoteCreationCredentials />
    case VoteCreationSteps.CREATION: return null // <VoteCreationCreation />
  }
  return null
}
