import { Col, Row, Text } from "@components/elements-v2"
import { AvailableIcons, Icon } from "@components/elements-v2/icons"
import { colorsV2 } from "@theme/colors-v2"
import { theme } from "@theme/global"
import styled from "styled-components"


export interface SocialNetworkProps {
  icon: AvailableIcons
  text: string
  link: string
}
export const SocialNetwork = (props: SocialNetworkProps) => {
  return (
    <StyledRow gutter='md' align='center' onClick={() => window.open(props.link)}>
      <Col>
        <Icon
          name={props.icon}
          color={theme.accent1}
          size={32}
        />
      </Col>
      <Col>
        <Text weight='medium' size='lg' color='dark-blue'>
          {props.text}
        </Text>
      </Col>
      <Col>
        <Icon
          name='external-link'
          color={colorsV2.neutral[200]}
          size={24}
        />
      </Col>
    </StyledRow>
  )
}
const StyledRow = styled(Row)`
cursor: pointer;
`
