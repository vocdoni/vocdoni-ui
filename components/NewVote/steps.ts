import React from "react"
import i18n from "../../i18n"
// import NewVoteDetails from "./NewVoteDetails"
// import NewVoteCensus from "./NewVoteCensus"
// import NewVoteGeneral from "./NewVoteGeneral"
// import NewVoteCompletion from "./NewVoteCompletion"

export const NewVoteSteps = {
  NewVoteDetails: {
    component: () => "NewVoteDetails",
    hideTopBar: false,
    step: i18n.t("vote.vote_details"),
  },
  NewVoteCensus: {
    component: () => "NewVoteCensus",
    hideTopBar: false,
    step: i18n.t("vote.who_can_vote"),
  },
  NewVoteGeneral: {
    component: () => "NewVoteGeneral",
    hideTopBar: false,
    step: i18n.t("vote.general"),
  },
  NewVoteCompletion: {
    component: () => "NewVoteCompletion",
    hideTopBar: true,
    step: null,
  }
}

export type INewVoteStepNames = keyof typeof NewVoteSteps
