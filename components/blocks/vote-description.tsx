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
        </Column>

        <Separator>&nbsp;</Separator>

        <Column>
          <DescriptionText>
            <p>L’Assemblea General Ordinària es convoca per presentar i validar, si escau, el Pla de Treball i el Pressupost del 2022. També ha de renovar bona part de la Junta Directiva.</p> 
            <p>L’Assemblea General se celebrarà presencialment el dissabte 26 de febrer a La Farga de l’Hospitalet de Llobregat (c/Barcelona número 2, l’Hospitalet de Llobregat).</p>
            <p>A continuació, en tot cas, pots fer les teves votacions anticipades als punts sotmesos a votació dels socis i sòcies.</p>

            <Separator>&nbsp;</Separator>

            <p>Ordre del dia:</p>
            <SimpleUl>
              <li>1) Benvinguda</li>
              <li>2) Aprovació, si escau, de l’acta de l’Assemblea General Ordinària del 18 de juny de 2021</li>
              <li>3) Presentació del Pla 26</li>
              <li>4) Breu memòria d’activitats 2021 i presentació i aprovació, si s’escau, del Pla de treball 2022</li>
              <li>5) Presentació i aprovació, si s’escau, del pressupost 2022</li>
              <li>6) Proclamació de la candidatura guanyadora les eleccions a la Junta Directiva</li>
              <li>7) Torn obert de paraula</li>
              <li>8) Cloenda amb discurs de presa de possessió i de la Junta Directiva amb presència d’autoritats i representants de la societat civil</li>
            </SimpleUl>

            <Separator>&nbsp;</Separator>
          </DescriptionText>

          <When condition={false}>
            <MarkDownViewer content={description} />
          </When>
        </Column>

        <Separator>&nbsp;</Separator>
        <Separator>&nbsp;</Separator>
        
        <Column sm={12} md={6}>
          <Button
            border
            wide
            icon={questionIcon}
            href=" https://www.omnium.cat/ca/area-socis/assemblea-general-2022/"
            target={LinkTarget.Blank}
            justify={JustifyContent.Left}
            omnium
          >
            <ButtonText>
              {i18n.t('vote.access_to_the_documentation')}
            </ButtonText>
          </Button>
        </Column>        
      
        <Column sm={12} md={6}>
          <Button
            border
            wide
            icon={pdfIcon}
            href="https://form.jotform.com/220242395353350"
            target={LinkTarget.Blank}
            justify={JustifyContent.Left}
            omnium
          >
            <ButtonText>{i18n.t('vote.questions_and_answers')}</ButtonText>
          </Button>
        </Column>        

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
  line-height: 22px;
  margin-left: 20px;
`
const SimpleUl = styled.ul`
  list-style: none;

  & > li {
    line-height:25px;
  }
`

const DescriptionText = styled.div`
  font-size: 16px;

  & > p {
    font-size: 16px;
  }
`