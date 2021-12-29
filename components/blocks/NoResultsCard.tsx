import { FlexContainer, FlexDirection, FlexJustifyContent } from "@components/elements/flex";
import { colors } from "@theme/colors";
import styled from "styled-components";
import { StringMappingType } from "typescript";
import { useIsMobile } from '@hooks/use-window-size'

interface INoResultsCardProps {
  title: string
  subtitle: string
}

export const NoResultsCard = (props: INoResultsCardProps) => {
  const isMobile = useIsMobile()
  return (
    <Card isMobile={isMobile}>
      <FlexContainer direction={FlexDirection.Column}>
        <Title isMobile={isMobile}>
          {props.title}
        </Title>
        <Subtitle isMobile={isMobile}>
          {props.subtitle}
        </Subtitle>
      </FlexContainer>
    </Card>
  )
}

const Card = styled.div<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => isMobile ? '24px' : '40px'};
  background-color: ${colors.lightBg};
  border-radius: 16px;
`
const Title = styled.span<{ isMobile: boolean }>`
  font-family: Manrope;
  font-weight: normal;
  align-self:center;
  font-size: ${({ isMobile }) => isMobile ? '20px' : '32px'};
  text-align:center;
  margin-bottom: 8px;
  color: ${colors.blueText}
`
const Subtitle = styled.span<{ isMobile: boolean }>`
  font-family: Manrope;
  font-weight: normal;
  align-self:center;
  margin-top: 8px;
  font-size: ${({ isMobile }) => isMobile ? '16px' : '20px'};
  color: ${colors.lightText}
`
