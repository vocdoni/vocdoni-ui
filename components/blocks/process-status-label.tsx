import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { VoteStatus } from '@lib/util'

interface IProcessStatusLabelProps {
  status : VoteStatus
}

export const ProcessStatusLabel = ({status}: IProcessStatusLabelProps) => {
  const { i18n } = useTranslation()

  switch (status) {
    case VoteStatus.Active:
        return <ActiveProcessStatusLabel>{i18n.t('vote.active_vote')}</ActiveProcessStatusLabel>

    case VoteStatus.Upcoming:
        return <UpcomingStatusLabel>{i18n.t('vote.upcoming_vote')}</UpcomingStatusLabel>

    case VoteStatus.Ended:
      return <EndedProcessStatusLabel>{i18n.t('vote.ended_vote')}</EndedProcessStatusLabel>

    case VoteStatus.Paused:
      return <EndedProcessStatusLabel>{i18n.t('vote.paused_vote')}</EndedProcessStatusLabel>

    case VoteStatus.Canceled:
      return <CanceledProcessStatusLabel>{i18n.t('vote.canceled_vote')}</CanceledProcessStatusLabel>

    default:
      return <></>
  }
}

const BaseProcessStatusLabel = styled.span`
  line-height: 36px;
  box-shadow: rgba(180,193,228,0.35) 0px 3px 3px;
  border-radius: 4px;
  height: 36px;
  padding: 2px 12px;
  font-size: 12px;
  font-weight: 500;
  min-width: 120px;
  text-align: center;
  color: ${({theme}) => theme.white}
  float:left;
`

const ActiveProcessStatusLabel = styled(BaseProcessStatusLabel)`
  background-color: ${({theme}) => theme.accent1C}
`

const UpcomingStatusLabel = styled(BaseProcessStatusLabel)`
  background-color: ${({theme}) => theme.accent1B}
`

const EndedProcessStatusLabel = styled(BaseProcessStatusLabel)`
  background-color: ${({theme}) => theme.textAccent2}
`

const CanceledProcessStatusLabel = styled(BaseProcessStatusLabel)`
  background-color:  ${({theme}) => theme.danger}
`

