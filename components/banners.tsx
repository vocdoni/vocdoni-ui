import styled from "styled-components"
import { Column, ColumnProps } from "./grid"
import { ReactNode } from "react"

type BannerProps = {
  warning?: boolean,
  title: string,
  subtitle: string,
  icon: ReactNode,
  rightButton?: ReactNode,
  children?: ReactNode,
}

export const Banner = (props: BannerProps) => <Column>
  <BannerDiv warning={props.warning}>
    <BannerMainDiv>
      <BannerIcon>{props.icon}</BannerIcon>
      <BanerText>
        <BannerTitle warning={props.warning}>{props.title}</BannerTitle>
        <BannerSubtitle>{props.subtitle}</BannerSubtitle>
      </BanerText>
      {props.rightButton ?
        <BannerRight>
          <RightLink>{props.rightButton}</RightLink>
        </BannerRight> :
        null
      }
    </BannerMainDiv>
    {props.children}
  </BannerDiv>
</Column>

// Styles

const BannerDiv = styled.div<{ warning?: boolean }>`
  padding: 56px 32px 32px;
  background: linear-gradient(106.26deg, ${({ theme, warning }) => warning ? theme.accentLight2B : theme.accentLight1B} 5.73%, ${({ theme, warning }) => warning ? theme.accentLight2 : theme.accentLight1} 93.83%);
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
  border-radius: 16px;
`

const BannerIcon = styled.div`
flex: 1;
`
const BanerText = styled.div`
flex: 10;
`
const BannerRight = styled.div`
text-align: right;
flex: 3;
`

const BannerMainDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`

const BannerTitle = styled.h2<{ warning?: boolean }>`
color: ${({ theme, warning }) => warning ? theme.textAccent2B : theme.text};
font-weight: normal;
margin: 0 0 10px;
`
const BannerSubtitle = styled.p`
color: ${props => props.theme.lighterText};
font-weight: normal;
margin: 16px 0;
`
const RightLink = styled.div`
line-height: 20px;
`