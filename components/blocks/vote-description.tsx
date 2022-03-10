import React, { RefObject, ReactNode, forwardRef, useEffect, ForwardedRef } from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'

import { VoteStatus } from '@lib/util'

import { colors } from 'theme/colors'

import { SectionText, TextSize } from '@components/elements/text'
import { Button, JustifyContent, LinkTarget } from '@components/elements/button'
import { Column, Grid } from '@components/elements/grid'
import { ProcessStatusLabel } from '@components/blocks/process-status-label'
import { When } from 'react-if'

import { MarkDownViewer } from './mark-down-viewer'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'

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
    }: IVotePageProps,
    ref
  ) => {
    const { i18n } = useTranslation()
    useEffect(() => {
      onComponentMounted && onComponentMounted(ref)
    }, [ref])

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
          <FlexContainer justify={FlexJustifyContent.Start}>
            <ProcessStatusLabel status={voteStatus} />
            <TimeComment>{timeComment}</TimeComment>
          </FlexContainer>

          { false && ( 
            <LogOutContainer>
              { onLogOut && <Button small border onClick={() => onLogOut()}>{i18n.t('app.header.disconnect_account')}</Button>}
            </LogOutContainer>
          )}
        </Column>

        <Column>
          <h5>Ordre del dia de l’<strong>Assemblea General Ordinària</strong></h5>

          <SimpleUl>
            <li>1. Aprovació, si escau, de l'<strong>acta de l'anterior assemblea.</strong></li>
            <li>2. Aprovació, si escau, de la <strong>memòria d'activitats 2021.</strong></li>
            <li>3. Aprovació, si escau, de l'<strong>estat de comptes 2021.</strong></li>
            <li>4. Aprovació, si escau, del <strong>projecte d'activitats 2022.</strong></li>
            <li>5. Aprovació, si escau, del <strong>pressupost de l'entitat 2022.</strong></li>
            <li>6. Tancament de l’urna electrònica del procés d’<strong>elecció de membres de l'Executiva</strong> que han esgotat el seu mandat (vicepresidència, secretaria i una part dels vocals)</li>
          </SimpleUl>

          <h5>Ordre del dia de l’<strong>Assemblea General Extraordinària</strong></h5>

          <SimpleUl>
            <li>1. Aprovació, si escau, de la proposta de modificació de l'<strong>article 11</strong>.</li>
            <li>2. Aprovació, si escau, de la proposta de modificació de l'<strong>article 18</strong>.</li>
            <li>3. Aprovació, si escau, de la proposta de modificació de l'<strong>article 41</strong>.</li>
            <li>4. Aprovació, si escau, de la proposta de modificació de l'<strong>article 42</strong>.</li>
            <li>5. Aprovació, si escau, de la proposta de modificació de l'<strong>article 43</strong>.</li>
            <li>6. Aprovació, si escau, de la proposta d’incorporació de l'<strong>article 44</strong>.</li>
          </SimpleUl>
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

        <When condition={hasVideo}>
          <Column>
            <LiveStreamVideoContainer ref={ref}>
              {liveStreamUrl && (
                <ReactPlayer url={liveStreamUrl} width="100%" />
              )}
            </LiveStreamVideoContainer>
          </Column>
        </When>
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

  @media ${({ theme }) => theme.screenMax.mobileL} {
    margin-left: 20px;
    margin-right: -30px;
  }
`
const SimpleUl = styled.ul`
  list-style: none;

  & > li {
    line-height:25px;
  }
`

const DescriptionText = styled.div`
  font-size: 16px;
  text-align: justify;
  margin-right: -30px;

  & > p {
    font-size: 16px;
  }
`

const VerticalSpace = styled.p`
  margin-top:6px;
`