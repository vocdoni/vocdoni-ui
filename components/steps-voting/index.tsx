import { useVoting } from "../../hooks/use-voting"
import i18n from "../../i18n"
import VotingPage from "./main"

// NOTE: Page steps are not used here. The stepper is used for the main action, 
// this is simply a compatibility placeholder.

export enum VotingPageSteps {
  // LOGIN = 0,
  VOTE = 1,
}

export const DEFAULT_VOTING_PAGE_STEP = VotingPageSteps.VOTE

export const VotingPageStepTitles = {
  // [VotingPageSteps.LOGIN]: i18n.t("vote.login"),
  [VotingPageSteps.VOTE]: i18n.t("vote.send_vote"),
}

export const VotingPageStep = () => {
  const { pageStep } = useVoting()

  switch (pageStep) {
    // case VotingPageSteps.LOGIN: return <FormLogin />
    case VotingPageSteps.VOTE: return <VotingPage />
  }
  return null
}
