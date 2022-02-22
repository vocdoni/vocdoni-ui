import { Card, Row, Col, Text, Spacer } from "@components/elements-v2"
import { useIsMobile } from "@hooks/use-window-size"

export interface DetailsCardProps {
  title: string
  options: IOption[]
}
type IOption = {
  title: string
  value: string
}
export const DetailsCard = (props: DetailsCardProps) => {
  const isMobile = useIsMobile()
  return (
    <Card variant='gray' padding={isMobile ? '20px' : '16px 24px'}>
      <Row gutter="xs">
        <Col xs={12}>
          <Text size='md' weight='semi-bold' color='dark-blue'>
            {props.title}
          </Text>
        </Col>
        <Col xs={12}>
          <Row>
            {
              props.options.map((option) =>
                <Col xs={12 / props.options.length}>
                  <Text size='xs' color='dark-gray'>
                    {option.title}
                  </Text>
                  <Spacer direction='vertical' size='2xs' />
                  <Text size='xs' color='dark-blue'>
                    {option.value}
                  </Text>
                </Col>
              )
            }
          </Row>
        </Col>
      </Row>
    </Card>
  )
}
