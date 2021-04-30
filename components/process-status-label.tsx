import React from 'react'
import styled from 'styled-components'
import { ProcessStatus } from 'dvote-js'
import i18n from '@i18n'

interface IProcessStatusLabelProps {
  status: ProcessStatus
}

export const ProcessStatusLabel = ({status}: IProcessStatusLabelProps) => {
  switch (status.value) {
    case ProcessStatus.READY:
      return <ActiveProcessStatusLabel>{i18n.t('vote.active_vote')}</ActiveProcessStatusLabel>

    case ProcessStatus.ENDED:
      return <EndedProcessStatusLabel>{i18n.t('vote.ended_vote')}</EndedProcessStatusLabel>

    case ProcessStatus.PAUSED:
      return <EndedProcessStatusLabel>{i18n.t('vote.paused_vote')}</EndedProcessStatusLabel>

    case ProcessStatus.CANCELED:
      return <EndedProcessStatusLabel>{i18n.t('vote.canceled_vote')}</EndedProcessStatusLabel>

    default:
      return <></>
  }
}

const BaseProcessStatusLabel = styled.span`
  border-radius: 10px;
  height: 16px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${({theme}) => theme.white}
`

const ActiveProcessStatusLabel = styled(BaseProcessStatusLabel)`
  background-color: ${({theme}) => theme.accent1C}
`

const EndedProcessStatusLabel = styled(BaseProcessStatusLabel)`
  background-color: ${({theme}) => theme.textAccent2}
`

const CanceledProcessStatusLabel = styled(BaseProcessStatusLabel)`
  background-color:  ${({theme}) => theme.danger}
`

