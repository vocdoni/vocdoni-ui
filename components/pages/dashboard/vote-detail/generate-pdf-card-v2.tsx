import { Card, Col, Row, Text, Button } from "@components/elements-v2"
import { ChevronRightIcon, Icon } from "@components/elements-v2/icons"
import { } from "@components/elements/button"
import { theme } from "@theme/global"

interface GeneratePdfCardProps {

}
export const GeneratePdfCard = (props: GeneratePdfCardProps) => {
  return (
    <Card variant="gray" padding="32px 78px">
      <Row gutter="lg">
        <Col xs={12} justify="center">
          <Row gutter="xs">
            <Col xs={12} justify="center">
              <Text align="center" color="dark-blue" size="xl" weight="bold">
                Total votes submited
              </Text>
            </Col>
            <Col xs={12} justify="center">
              <Text align="center" color="dark-blue" size="2xl">
                0&nbsp;
                <Text align="center" color="dark-gray">
                  (0%)
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
                iconRight={<Icon color={theme.white} name='chevron-right' />}
              >
                See Results
              </Button>
            </Col>
            <Col xs={12}>
              <Button
                variant="primary"
                iconRight={<Icon name='chevron-right' />}
                // iconRight={<DownloadIcon />}
              >
                Generate PDF
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}
