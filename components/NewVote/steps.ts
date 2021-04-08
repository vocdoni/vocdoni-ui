import i18n from "../../i18n"
import { FormDetails } from "./details"
// import NewVoteCensus from "./NewVoteCensus"
// import NewVoteGeneral from "./NewVoteGeneral"
// import NewVoteCreation from "./NewVoteCreation"

export enum VoteCreationSteps {
  DETAILS = 0,
  CENSUS = 1,
  GENERAL = 2,
  CREATION = 3
}

export const VoteCreationStepComponents = {
  [VoteCreationSteps.DETAILS]: {
    component: FormDetails,
    hideTopBar: false,
    stepTitle: i18n.t("vote.vote_details"),
  },
  [VoteCreationSteps.CENSUS]: {
    component: () => "NewVoteCensus",
    hideTopBar: false,
    stepTitle: i18n.t("vote.who_can_vote"),
  },
  [VoteCreationSteps.GENERAL]: {
    component: () => "NewVoteGeneral",
    hideTopBar: false,
    stepTitle: i18n.t("vote.general"),
  },
  [VoteCreationSteps.CREATION]: {
    component: () => "NewVoteCreation",
    hideTopBar: true,
    stepTitle: null,
  }
}
