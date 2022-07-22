import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'
import { colors } from 'theme/colors'
import { SectionText, TextSize } from '@components/elements/text'
import { ProcessStatusLabel } from '@components/blocks-v2/process-status-label'
import { CalendarCard } from '@components/pages/pub/votes/components/calendar-card'
import { SettingsCard } from '@components/pages/pub/votes/components/settings-card'
import { LinkButton } from '@components/elements-v2/link-button'
import { ExpandableContainer } from './expandable-container'
import { Col, Row } from '@components/elements-v2/grid'
import { useUrlHash } from 'use-url-hash'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { When } from 'react-if'
import { DocumentOutlinedIcon, QuestionOutlinedIcon } from '@components/elements-v2/icons'


export const VoteDescription = () => {
  const { i18n } = useTranslation()
  const processId = useUrlHash().slice(1)
  const {
    description,
    liveStreamUrl,
    discussionUrl,
    attachmentUrl,
    startDate,
    endDate,
    votingType,
    isAnonymous
  } = useProcessWrapper(processId)

  // This is used to make the video url have its own
  // lifecycle so it not rerenders the video automatically
  // when dvotejs polling is done
  // When the dvot js polling is done, for a brief
  // moment the value is undefined before is set
  // to its final value.
  // React detects this as a change and the video
  // blinks, stops and reload
  const [videoUrl, setVideoUrl] = useState('')
  useEffect(() => {
    if (videoUrl !== liveStreamUrl && liveStreamUrl !== undefined) {
      setVideoUrl(liveStreamUrl)
    }
  }, [liveStreamUrl])

  return (
    // MAIN ROW
    <Row gutter='3xl'>

      {/* VIDEO */}
      <When condition={videoUrl && false}>
        <Col id='video' align='center' xs={12} justify='center'>
          {/* INSIDE ROW TO ADJUST GUTTER BETWEEN TITLE AND VIDEO*/}
          <Row gutter='md'>
            { false && 
              <Col xs={12}>
                <SectionText size={TextSize.Big} color={colors.blueText}>
                  {i18n.t('vote.live_stream')}
                </SectionText>
              </Col>
            }
            <Col id='videoContainer' xs={12} sm={12} md={8} align='center'>
              <PlayerFixedContainer>
                <PlayerContainer>
                  <ReactPlayer
                    url={videoUrl}
                    width="100%"
                    height="100%"
                  />
                </PlayerContainer>
              </PlayerFixedContainer>
            </Col>
          </Row>
        </Col>
      </When>

      {/* TAG AND DESCRIPCTION */}
      <Col xs={12}>
        {/* INSIDE ROW TO AJUST GUTTER */}
        <Row gutter='xl'>
          <Col xs={12}>
            <ProcessStatusLabel />
          </Col>
          {false && description &&
            <Col xs={12}>
              <ExpandableContainer
                lines={5}
                buttonText={i18n.t('vote.show_more')}
                buttonExpandedText={i18n.t('vote.show_less')}
              >
                {description}
              </ExpandableContainer>
            </Col>
          }
        </Row>
      </Col>

      {/* DATE AND SETTINGS CARDS */}
      { false && 
        <Col xs={12}>
          <Row gutter='lg'>
            <Col xs={12} md={6}>
              <CalendarCard
                startDate={startDate}
                endDate={endDate}
              />
            </Col>
            <Col xs={12} md={6}>
              <SettingsCard
                votingType={votingType}
                isAnonymous={isAnonymous}
              />
            </Col>
          </Row>
        </Col>
      }

      {/* LINKS */}
      { false && 
        <Col xs={12}>
          <Row gutter='md'>
            <Col xs={12}>
              <SectionText size={TextSize.Big} color={colors.blueText}>
                {i18n.t('vote.extra_information')}
              </SectionText>
            </Col>
            <Col xs={12}>
              <Row gutter='lg'>
                <Col xs={12} md={6}>
                  <LinkButton
                    href={attachmentUrl}
                    target="_blank"
                    disabled={attachmentUrl === undefined || !attachmentUrl}
                    icon={<DocumentOutlinedIcon />

                    }
                  >
                    {i18n.t('vote.access_to_the_documentation')}
                  </LinkButton>
                </Col>
                <Col xs={12} md={6}>
                  <LinkButton
                    icon={<QuestionOutlinedIcon />}
                    href={discussionUrl}
                    disabled={discussionUrl === undefined || !discussionUrl}
                    target="_blank"
                  >
                    {i18n.t('vote.questions_and_answers')}
                  </LinkButton>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      }
    </Row>
    // </Grid >
  )
}

const PlayerFixedContainer = styled.div`
  z-index: 30;
  transition: all 0.4s ease-in-out;
  top: 0px;
  height: 360px;
  @media ${({ theme }) => theme.screenMax.tabletL} {
    height: 300px;
  }
  @media ${({ theme }) => theme.screenMax.mobileL} {
    height: 160px;
  }
  width: 100%;
  margin-top: 20px;
`

const PlayerContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
`
