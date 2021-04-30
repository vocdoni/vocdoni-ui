import React from 'react'

import i18n from '@i18n'

import { Banner } from '@components/banners'
import { ImageContainer } from '@components/images'
import { Grid } from '@components/grid'

interface IVoteRegisteredCardProps {
  voteLink: string
}

export const VoteRegisteredCard = ({ voteLink }: IVoteRegisteredCardProps) => {
  return (
    <Grid>
      <Banner
        title={i18n.t('vote.your_vote_has_been_registered')}
        subtitle={<a href={voteLink}>{voteLink}</a>}
        icon={<ImageContainer width="80px">
          <img src='/images/vote/vocdoni-vote.png' alt={i18n.t('vote.voted_alt')}/>
        </ImageContainer>}
      />
    </Grid>
  )
}
