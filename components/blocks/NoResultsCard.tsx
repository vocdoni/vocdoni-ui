import { colors } from "@theme/colors";
import styled from "styled-components";
import { useIsMobile } from '@hooks/use-window-size'
import { Col, Row } from "@components/elements-v2/grid";
import { Text } from "@components/elements-v2/text";
import { Card } from "@components/elements-v2/card";

interface INoResultsCardProps {
  title: string
  subtitle: string
}

export const NoResultsCard = (props: INoResultsCardProps) => {
  const isMobile = useIsMobile()
  return (
    <Card padding={isMobile ? '24px' : '40px'} variant="gray">
      <Row gutter="md">
        <Col justify="center" xs={12}>
          <Text size={isMobile ? 'xl' : '3xl'} color="dark-blue" align="center">
            {props.title}
          </Text>
        </Col>
        <Col justify="center" xs={12}>
          <Text size={isMobile ? 'sm' : 'xl'} color="dark-gray" align="center">
            {props.subtitle}
          </Text>
        </Col>
      </Row>
    </Card>
  )
}

