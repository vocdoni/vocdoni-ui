import { Col, Row, IRowProps } from "@components/elements-v2/grid"
import { Tag } from "@components/elements-v2/tag"
import { Text } from "@components/elements-v2/text"
import { useIsMobile } from "@hooks/use-window-size"
import { useTranslation } from "react-i18next"
import styled from "styled-components"


export type ITotalVotesCount = {
  totalVotes: number,
  censusSize?: number
}


export const TotalVotesCard = (props: ITotalVotesCount) => {
  const isMobile = useIsMobile()
  const { i18n } = useTranslation()
  const VotesPercent = () => {
    return (
      <Row gutter="xs" justify={isMobile ? 'center' : 'start'} >
        <Col>
          <Text size="lg" color="dark-blue" weight="bold">
            {props.totalVotes.toLocaleString(i18n.language)}
          </Text>
        </Col>
        <Col>
          <Text size="lg" color="dark-gray">
            (500%)
          </Text>
        </Col>
      </Row>
    )
  }
  return (
    <StyledRow {...props} gutter={isMobile ? 'sm' : 'md'} align="center" justify={isMobile ? 'center' : 'start'}>
      <Col>
        <Tag fontWeight="regular" size="large">
          {i18n.t('vote.total_votes_submited')}
        </Tag>
      </Col>
      <Col xs={12} md={8}>
        <VotesPercent />
      </Col>
    </StyledRow>
  )
}

const StyledRow = styled(Row) <IRowProps>`


`
