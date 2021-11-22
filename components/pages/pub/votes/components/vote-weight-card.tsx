import React from 'react'
import { Banner } from '@components/blocks/banner_v2'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { useTranslation } from 'react-i18next'

interface IVoteWeightedCardProps {
  voteWeight: number
}

export const VoteWeightCard = ({ voteWeight }: IVoteWeightedCardProps) => {
  const { i18n } = useTranslation()
  return (
    <Banner>
      <Typography variant={TypographyVariant.Small}>
        {i18n.t('vote.this_is_weighted_voted')}
      </Typography>
      <Typography variant={TypographyVariant.MediumSmall}>
        {i18n.t('vote.you_got_attributed_a_voting_power_per_question', {
          voteWeight,
        })}
      </Typography>
    </Banner>
  )
}
