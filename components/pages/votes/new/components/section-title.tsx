import { Col, Row, Text } from "@components/elements-v2"

export interface SectionTitleProps {
  title: string
  subtitle: string
  index: number
}
export const SectionTitle = (props: SectionTitleProps) => {
  return (
    <Row gutter='md'>
      <Col xs={12}>
        <Text size='2xl' color='dark-blue'>
          {props.index}.&nbsp;{props.title}
        </Text>
      </Col>
      <Col xs={12}>
        <Text size='sm' color='light-gray'>
          {props.subtitle}
        </Text>
      </Col>
    </Row>
  )
}
