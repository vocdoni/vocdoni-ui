import React from 'react'
import styled from 'styled-components'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'
import { colors } from 'theme/colors'
import { SectionText, TextSize } from '@components/elements/text'
import { ProcessStatusLabelV2 } from '@components/blocks/process-status-label-v2'
import { CalendarCard } from '@components/blocks/calendar-card'
import { SettingsCard } from '@components/blocks/settings-card'
import { LinkButton } from '@components/elements-v2/link-button'
import { useIsMobile } from '@hooks/use-window-size'
import { ExpandableContainer } from './expandable-container'
import { Col, Row } from '@components/elements-v2/grid'
import { useUrlHash } from 'use-url-hash'
import { useProcessInfo } from '@hooks/use-process-info'
import { When } from 'react-if'


export const VoteDescription = () => {
  const { i18n } = useTranslation()
  const isMobile = useIsMobile()
  const processId = useUrlHash().slice(1)
  const { description, liveStreamUrl, discussionUrl, attachmentUrl } = useProcessInfo(processId)
  return (
    // MAIN ROW
    <Row gutter='xxxl'>
      {/* TAG AND DESCRIPCTION */}
      <Col xs={12}>
        {/* INSIDE ROW TO AJUST GUTTER */}
        <Row gutter='xl'>
          <Col xs={12}>
            <ProcessStatusLabelV2 />
          </Col>
          {description &&
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
      <Col xs={12}>
        {/* INSIDE ROW TO ADJUST GUTTER */}
        <Row gutter='lg'>
          <Col xs={12} md={6}>
            <CalendarCard />
          </Col>
          <Col xs={12} md={6}>
            <SettingsCard />
          </Col>
        </Row>
      </Col>

      {/* VIDEO */}
      <When condition={liveStreamUrl}>
        <Col xs={12}>
          {/* INSIDE ROW TO ADJUST GUTTER BETWEEN TITLE AND VIDEO*/}
          <Row gutter='md'>
            <Col xs={12}>
              <SectionText size={TextSize.Big} color={colors.blueText}>
                {i18n.t('vote.live_stream')}
              </SectionText>
            </Col>
            <Col xs={12}>
              <PlayerFixedContainer>
                <PlayerContainer>
                  <ReactPlayer
                    url={liveStreamUrl}
                    width="100%"
                    height="100%"
                  />
                </PlayerContainer>
              </PlayerFixedContainer>
            </Col>
          </Row>
        </Col>
      </When>

      {/* LINKS */}
      {(discussionUrl || attachmentUrl) &&
        <Col xs={12}>
          {/* INSIDE ROW TO ADJUST GUTTER BETWEEN TITLE AND LINKS*/}
          <Row gutter='md'>
            <Col xs={12}>
              <SectionText size={TextSize.Big} color={colors.blueText}>
                {i18n.t('vote.extra_information')}
              </SectionText>
            </Col>
            <Col xs={12}>
              {/* INSIDE ROW TO ADJUST GUTTER BETWEEN 2 LINKS */}
              <Row gutter='lg'>
                {attachmentUrl &&
                  <Col xs={12} md={6}>
                    <LinkButton
                      href={attachmentUrl}
                      target="_blank"
                      icon={
                        <img
                          src="/images/vote/pdf-outlined.svg"
                          alt={i18n.t('vote.pdf_image_alt')}
                        />
                      }
                    >
                      {i18n.t('vote.access_to_the_documentation')}
                    </LinkButton>
                  </Col>
                }
                {discussionUrl &&
                  <Col xs={12} md={6}>
                    <LinkButton
                      icon={
                        <img
                          src="/images/vote/question-outlined.svg"
                          alt={i18n.t('vote.question_image_alt')}
                        />
                      }
                      href={discussionUrl}
                      target="_blank"
                    >
                      {i18n.t('vote.questions_and_answers')}
                    </LinkButton>
                  </Col>
                }
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
`

const PlayerContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
`
