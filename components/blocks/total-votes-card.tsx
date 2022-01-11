import { Col, Row } from "@components/elements-v2/grid"
import { Tag } from "@components/elements-v2/tag"
import { Text } from "@components/elements-v2/text"
import { useProcessInfo } from "@hooks/use-process-info"
import { useProcessWrapper } from "@hooks/use-process-wrapper"
import { useIsMobile } from "@hooks/use-window-size"
import { VotingType } from "@lib/types"
import { useProcess } from "@vocdoni/react-hooks"
import { useTranslation } from "react-i18next"
import { When } from "react-if"
import { useUrlHash } from "use-url-hash"

export const TotalVotesCard = () => {
  const isMobile = useIsMobile()
  const processId = useUrlHash().slice(1)
  const { i18n } = useTranslation()
  const { censusSize, totalVotes } = useProcessInfo(processId)
  return (
    <Row gutter={isMobile ? 'sm' : 'md'} align="center" justify={isMobile ? 'center' : 'start'}>
      <Col>
        <Tag fontWeight="regular" size="large">
          {i18n.t('vote.total_votes_submited')}
        </Tag>
      </Col>
      <Col xs={12} md={8}>
        <When condition={totalVotes && censusSize}>
          {totalVotes && censusSize &&
            <Row gutter="xs" justify={isMobile ? 'center' : 'start'} >
              <Col>
                <Text size="lg" color="dark-blue" weight="bold">
                  {totalVotes.toLocaleString(i18n.language)}
                </Text>
              </Col>
              <Col>
                <Text size="lg" color="dark-gray">
                  ({totalVotes / (censusSize || 0) * 100}%)
                </Text>
              </Col>
            </Row>
          }
        </When>
      </Col>
    </Row>
  )
}
