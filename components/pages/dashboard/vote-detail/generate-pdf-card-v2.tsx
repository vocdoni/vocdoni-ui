import { Card, Col, Row, Text, Button } from "@components/elements-v2"
import { ChevronRightIcon, DownloadIcon, Icon } from "@components/elements-v2/icons"
import { } from "@components/elements/button"
import { useProcessWrapper } from "@hooks/use-process-wrapper"
import { VoteStatus } from "@lib/util"
import { theme } from "@theme/global"
import votes from "pages/votes"
import { useTranslation } from "react-i18next"
import { useUrlHash } from "use-url-hash"
import { ResultPdfGenerator } from '@lib/result-pdf-generator'
import { useEntity } from "@vocdoni/react-hooks"
import { useWallet, WalletRoles } from "@hooks/use-wallet"
import styled from "styled-components"
import { BigNumber } from "ethers"

interface GeneratePdfCardProps {
  onSeeResultsClick?: () => void
}
export const GeneratePdfCard = (props: GeneratePdfCardProps) => {
  const { i18n } = useTranslation()
  // get process data
  const processId = useUrlHash().slice(1)
  const { status, censusSize, liveResults, results, processInfo, title, participationRate, totalVotes } = useProcessWrapper(processId)
  // geet entity data
  const { wallet } = useWallet({ role: WalletRoles.ADMIN })
  const { metadata: entityMetadata } = useEntity(wallet?.address)
  // compute constants
  const resultsAvailable = status === VoteStatus.Ended || liveResults
  // disabled buttons
  const generatePdfEnabled = [VoteStatus.Ended, VoteStatus.Active].includes(status)
  const seeResultsEnabled = [VoteStatus.Ended, VoteStatus.Active].includes(status)
  // download PDF
  const handleDownloadPDF = () => {
    const resultPdfGenerator = new ResultPdfGenerator({ process: processInfo, processResults: results })
    const linkElement = document.createElement('a')
    resultPdfGenerator.generatePdfUrl()
      .then(pdfLink => {
        linkElement.setAttribute('target', "_blank")
        linkElement.setAttribute('href', pdfLink)
        linkElement.setAttribute('download', `${entityMetadata.name.default}_${title}_${(new Date()).toISOString().split('T')[0]}.pdf`)
        linkElement.click()
      })
  }
  return (
    <StyledCard variant="gray" padding="32px 78px">
      <Row gutter="lg">
        <Col xs={12} justify="center">
          <Row gutter="xs">
            <Col xs={12} justify="center">
              <Text align="center" color="dark-blue" size="xl" weight="bold">
                {i18n.t('vote_detail.generate_pdf_card.title')}
              </Text>
            </Col>
            <Col xs={12} justify="center">
              <Text align="center" color="dark-blue" size="2xl">
                {totalVotes} &nbsp;
                <Text align="center" color="dark-gray">
                  {(participationRate != "0") ? "("+participationRate+"%)" : ""}
                </Text>
              </Text>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row gutter="md">
            <Col xs={12}>
              <Button
                variant="primary"
                disabled={!generatePdfEnabled}
                onClick={props.onSeeResultsClick}
                icon
                iconRight={{ name: 'chevron-right', size: 16 }}
              >
                {i18n.t('vote_detail.generate_pdf_card.see_results')}
              </Button>
            </Col>
            <Col xs={12}>
              <Button
                disabled={!seeResultsEnabled}
                onClick={handleDownloadPDF}
                variant="white"
                iconLeft={{ name: 'download', size: 24 }}
              >
                {i18n.t('vote_detail.generate_pdf_card.generate_pdf')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
@media ${theme.screenMin.laptopL}  {
  padding:32px 78px
}
@media ${theme.screenMin.tablet} and ${theme.screenMax.laptopL}{
  padding: 32px
}
`
