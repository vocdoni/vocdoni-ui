import React from 'react'
import { Banner, BannerSize, BannerVariant } from '@components/blocks/banner_v2'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { useTranslation } from 'react-i18next'

interface IVoteWeightedCardProps {
  voteWeight: string
}

export const VoteWeightCard = ({ voteWeight }: IVoteWeightedCardProps) => {
  const { i18n } = useTranslation()
  return (
    <Banner
      icon={<img src="/images/vote/vote-weighted.png" />}
      size={BannerSize.Small}
      variant={BannerVariant.Primary}
    >
      <Typography variant={TypographyVariant.Small} margin='0 0 14px 0'>
        {i18n.t('vote.this_is_weighted_voted')}
      </Typography>
      <Typography variant={TypographyVariant.MediumSmall} margin='0'>
        {i18n.t('vote.you_got_attributed_a_voting_power_per_question', {
          voteWeight,
        })}
      </Typography>
    </Banner>
  )
}
