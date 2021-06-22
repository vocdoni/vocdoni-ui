import React from 'react'

import i18n from '@i18n'

import { Banner } from '@components/blocks/banners'
import { ImageContainer } from '@components/elements/images'
import { Grid } from '@components/elements/grid'

interface IVoteRegisteredCardProps {
  explorerLink: string
}

export const VoteRegisteredCard = ({ explorerLink }: IVoteRegisteredCardProps) => {
  return (
    <Grid>
      <Banner
        title={i18n.t('vote.your_vote_has_been_registered')}
        subtitle={<a href={explorerLink} target="_blank">{i18n.t("vote.you_can_verify_its_inclusion_on_the_block_explorer")}</a>}
        icon={<ImageContainer width="80px">
          <img src='/images/vote/vocdoni-vote.png' alt={i18n.t('vote.voted_alt')}/>
        </ImageContainer>}
      />
    </Grid>
  )
}
