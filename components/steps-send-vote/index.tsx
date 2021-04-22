import { useProcessCreation } from "../../hooks/process-creation"
import i18n from "../../i18n"
import { FormLogin } from "./login"
import { FormVote } from "./vote"

export enum SendVotePageSteps {
  LOGIN = 0,
  VOTE = 1,
}

export const SendVotePageStepTitles = {
  [SendVotePageSteps.LOGIN]: i18n.t("vote.login"),
  [SendVotePageSteps.VOTE]: i18n.t("vote.send_vote"),
}

export const SendVotePageStep = () => {
  const { pageStep } = useProcessCreation()

  switch (pageStep) {
    case SendVotePageSteps.LOGIN: return <FormLogin />
    case SendVotePageSteps.VOTE: return <FormVote />
  }
  return null
}
