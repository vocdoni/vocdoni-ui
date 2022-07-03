import { WaitingBanner } from "@components/blocks-v2"
import { Spacer, Col, Row, Text } from "@components/elements-v2"
import { LoadingIcon, LogOutIcon, Rotate } from "@components/elements-v2/icons"
import { useTranslation } from "react-i18next"
import styled, { keyframes } from "styled-components"


export const VoteSubmitting = () => {
  const { i18n } = useTranslation()
  return (
    <ModalContainer>
      <Spacer direction='vertical' size='3xl' />
      <Spacer direction='vertical' size='3xl' />
      <Row gutter="2xl">
        <Col xs={12}>
          <Row justify="center" gutter="md" align="center">
            <Col justify="start">
              <img
                src='/images/app/fcb_logo.png'
                alt="vote"
                height={100}
                width={92}
              />
              <AbsoluteDiv>
                <Rotate>
                  <LoadingIcon size="20" />
                </Rotate>
              </AbsoluteDiv>
            </Col>
            <Col xs={12} justify="center">
              <Text size="2xl" weight='medium' color="dark-blue" align="center">
                {i18n.t('vote.submitting_vote')}
              </Text>
            </Col>
            <Col xs={12} justify="center">
              <Text size="sm" color="dark-gray" align="center" >
                {i18n.t('vote.submitting_vote_msg')}
              </Text>
            </Col>
          </Row>
        </Col>
        { false && 
          <Col xs={12}>
            <WaitingBanner forceMobile messages={i18n.t("waiting_banner.vote_submitting", { returnObjects: true })} />
          </Col>
        }
      </Row>
    </ModalContainer>
  )
}
const AbsoluteDiv = styled.div`
position: absolute;
  transform: translateY(-35px) translateX(35px);
`
// This is a hot fix for
// for some reason the
// modal shows a scroll
// bar independently of
// the content inside
const ModalContainer = styled.div`
min-height: 438px;
`
