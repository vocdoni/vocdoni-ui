import { WaitingBanner } from "@components/blocks-v2"
import { Col, Row, Text } from "@components/elements-v2"
import { LoadingIcon, LogOutIcon, Rotate } from "@components/elements-v2/icons"
import { useTranslation } from "react-i18next"
import styled, { keyframes } from "styled-components"


export const VoteSubmitting = () => {
  const { i18n } = useTranslation()
  return (
    <Row gutter="2xl">
      <Col xs={12}>
        <Row justify="center" gutter="md" align="center">
          <Col justify="center">
            <img
              src='/images/vote/vote-now.png'
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
              Your vote is being submitted...
            </Text>
          </Col>
          <Col xs={12} justify="center">
            <Text size="sm" color="dark-gray" align="center" >
              Please don’t close the window, this action may take a few minutes.
            </Text>
          </Col>
        </Row>
      </Col>
      <Col xs={12}>
        <WaitingBanner forceMobile messages={i18n.t("vote.waiting_messages", { returnObjects: true })} />
      </Col>
    </Row>
  )
}
const AbsoluteDiv = styled.div`
position: absolute;
  transform: translateY(-35px) translateX(35px);
`
