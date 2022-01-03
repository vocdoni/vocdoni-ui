import { colors } from "@theme/colors";
import styled from "styled-components";
import { useIsMobile } from '@hooks/use-window-size'
import { Col, Row } from "@components/elements-v2/grid";
import { Text } from "@components/elements-v2/text";

interface INoResultsCardProps {
  title: string
  subtitle: string
}

export const NoResultsCard = (props: INoResultsCardProps) => {
  const isMobile = useIsMobile()
  return (
    <Card isMobile={isMobile}>
      <Row justify="center" gutter="md">
        <Col justify="center" xs={12}>
          <StyledText size={isMobile ? 'xl' : 'display-1'} color="dark-blue">
            {props.title}
          </StyledText>
        </Col>
        <Col justify="center" xs={12}>
          <StyledText size={isMobile ? 'sm' : 'xl'} color="dark-gray">
            {props.subtitle}
          </StyledText>
        </Col>
      </Row>
    </Card>
  )
}

const Card = styled.div<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => isMobile ? '24px' : '40px'};
  background-color: ${colors.lightBg};
  border-radius: 16px;
`
const StyledText = styled(Text)`
  text-align: center;
`
