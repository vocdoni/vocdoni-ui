import React, { RefObject, ReactNode, forwardRef, useEffect, ForwardedRef } from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'

import { VoteStatus } from '@lib/util'

import { Button, JustifyContent, LinkTarget } from '@components/elements/button'
import { Column, Grid } from '@components/elements/grid'
import { ProcessStatusLabel } from '@components/blocks/process-status-label'
import { When } from 'react-if'

import { MarkDownViewer } from './mark-down-viewer'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'

import { VotingState } from '@components/pages/pub/votes/index'

interface IVotePageProps {
  description: string
  hasVideo?: boolean
  liveStreamUrl?: string
  attachmentUrl?: string
  discussionUrl?: string
  voteStatus: VoteStatus
  timeComment: string
  onLogOut?: () => void
  onComponentMounted?: (ref: ForwardedRef<HTMLDivElement>) => void
  votingState?: VotingState
}

export const VoteDescription = forwardRef<HTMLDivElement, IVotePageProps>(
  (
    {
      description,
      hasVideo,
      liveStreamUrl,
      attachmentUrl,
      discussionUrl,
      voteStatus,
      timeComment,
      onLogOut,
      onComponentMounted,
      votingState
    }: IVotePageProps,
    ref
  ) => {
    const { i18n } = useTranslation()
    useEffect(() => {
      onComponentMounted && onComponentMounted(ref)
    }, [ref])

    const getTitleFromState = (status: VotingState) => {
      switch (status) {
        case VotingState.Ended:
          return i18n.t('vote.your_vote_has_been_registered')
      }
    }

    const pdfIcon = (
      <img src="/images/vote/faq.png" width="32" alt={i18n.t('vote.pdf_image_alt')} />
    )
    const questionIcon = (
      <img
        src="/images/vote/pdf.png" width="26" alt={i18n.t('vote.question_image_alt')}
      />
    )

    return (
      <Grid>
        <Column>
          <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
            <div>
              <ProcessStatusLabel status={voteStatus} />
              <TimeComment>El període de votació és del 21 d'abril al 4 de maig</TimeComment>
            </div>
            <VoteStatusText>{getTitleFromState(votingState)}</VoteStatusText>
          </FlexContainer>

          { false && (
            <LogOutContainer>
              { onLogOut && <Button small border onClick={() => onLogOut()}>{i18n.t('app.header.disconnect_account')}</Button>}
            </LogOutContainer>
          )}
        </Column>        

        <Column>
          <DescriptionText>
            <p>L’empresa Gestió i Serveis Funeraris de Bellpuig ha fet una proposta d’instal·lació d’un nou tanatori que inclou una sala ecumènica i un forn crematori per a incineracions de persones difuntes. El lloc on l’empresa té previst instal·lar aquest equipament és el carrer Puntaires que es troba al polígon industrial que hi ha al Camí del Bosc.</p>
            <p>Per dur a terme aquesta instal·lació cal modificar l’actual POUM per permetre els usos funeraris en sòl industrial.</p>
            <p>L’equip de govern de l’Ajuntament de Bellpuig va proposar el 5 d’octubre de 2020 al Ple Municipal un acord pel qual es consultés a la població de Bellpuig sobre si considera oportú que a Bellpuig hi hagi aquestes instal·lacions. Van votar a favor de celebrar aquesta consulta els 6 membres del grup Acord Municipal Republicà-Esquerra Republicana i les dues membres de CUP-Amunt; hi van votar en contra els 5 membres del grup Junts per Bellpuig. Tenint en compte el resultat de la votació del ple municipal se celebrarà la consulta a la població i el seu resultat serà vinculant.</p>
          </DescriptionText>
        </Column>

        <Separator>&nbsp;</Separator>
        <Separator>&nbsp;</Separator>

        <When condition={attachmentUrl}>
          <Column sm={12} md={7}>
            <Button
              border
              wide
              icon={questionIcon}
              href={attachmentUrl}
              target={LinkTarget.Blank}
              justify={JustifyContent.Left}
              omnium
            >
              <ButtonText>
                {i18n.t('vote.access_to_the_documentation')}
              </ButtonText>
            </Button>
          </Column>
        </When>

        <Separator>&nbsp;</Separator>

        <When condition={discussionUrl}>
          <Column sm={12} md={7}>
            <Button
              border
              wide
              icon={pdfIcon}
              href={discussionUrl}
              target={LinkTarget.Blank}
              justify={JustifyContent.Left}
              omnium
            >
              <ButtonText>{i18n.t('vote.questions_and_answers')}</ButtonText>
            </Button>
          </Column>
        </When>

        <Separator>&nbsp;</Separator>

        <When condition={hasVideo}>
          <Column>
            <LiveStreamVideoContainer ref={ref}>
              {liveStreamUrl && (
                <ReactPlayer url={liveStreamUrl} width="100%" />
              )}
            </LiveStreamVideoContainer>
          </Column>
        </When>

        <Separator>&nbsp;</Separator>
        <Separator>&nbsp;</Separator>
      </Grid>
    )
  }
)

const LogOutContainer = styled.div`
  display: none;

  @media ${({ theme }) => theme.screenMax.tablet} {
    display: block;
  }

`
const ButtonText = styled.p`
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  margin: 0 20px;
`

const LiveStreamVideoContainer = styled.div`
  height: 360px;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    height: 300px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    height: 160px;
  }
`
const Separator = styled.div`
  margin:0px;
  padding-top:5px;
  padding-bottom: 5px;
`

const TimeComment = styled.div`
  line-height: 36px;
  margin-left: 20px;
  margin-right: -40px;
  float:right;
  margin-bottom: 20px;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    margin-left: 20px;
    margin-right: -30px;
  }
`

const VoteStatusText = styled.div`
  line-height: 36px;
  margin-left: 20px;
`

const SimpleUl = styled.ul`
  list-style: none;

  & > li {
    line-height:25px;
  }
`

const VerticalSpace = styled.p`
  margin-top:6px;
`


const DescriptionText = styled.div`
  font-size: 16px;
  text-align: justify;

  & li  {
    white-space: initial;
  }

  & p {
    margin: 0 0.4em 24px;
    font-size: 16px;
    line-height: 32px;
    text-align: justify;
  }

  & blockquote {
    border-left: 1px solid #e0e0e0;
    padding-left: 20px;
    margin-left: 0px;
  }
  
  & h1 {
    font-size: 18px;
    font-weight: 500;
  }

  & h2 {
    font-size: 16px;
    font-weight: 500;
  }
`