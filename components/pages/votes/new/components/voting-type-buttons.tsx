import React from 'react'
import { useTranslation } from 'react-i18next'
import { VotingType } from '@lib/types'

import {
  BtnGroup,
  BtnGroupContainer,
  BtnGroupSubText,
  BtnGroupText,
} from './btn-group'

interface VotingTypeButtonsProps {
  onClick: (type: VotingType) => void
  votingType: VotingType
}

export const VotingTypeButtons = ({
  onClick,
  votingType,
}: VotingTypeButtonsProps) => {
  const { i18n } = useTranslation()

  return (
    <BtnGroupContainer>
      <BtnGroup
        active={votingType === VotingType.Normal}
        onClick={() => onClick(VotingType.Normal)}
        size='small'
      >
        <BtnGroupText>{i18n.t('votes.new.normal_voting')}</BtnGroupText>
        <BtnGroupSubText>
          {i18n.t('votes.new.all_the_voters_has_the_same_power')}
        </BtnGroupSubText>
      </BtnGroup>

      <BtnGroup
        active={votingType === VotingType.Weighted}
        onClick={() => onClick(VotingType.Weighted)}
        size='small'
      >
        <BtnGroupText>{i18n.t('votes.new.weighted_voting')}</BtnGroupText>
        <BtnGroupSubText>
          {i18n.t('votes.new.set_different_power_to_each_voter')}
        </BtnGroupSubText>
      </BtnGroup>
    </BtnGroupContainer>
  )
}
