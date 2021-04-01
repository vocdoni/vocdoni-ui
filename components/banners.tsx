import styled from "styled-components"
import { Column, ColumnProps } from "./grid"
import { ReactNode } from "react"

type BannerProps = {
  title: string,
  subtitle: string,
  icon: ReactNode,
  rightButton?: ReactNode,
  children: ReactNode,
}

export const Banner = (props: BannerProps) => <Column>
  <BannerDiv>
    <BannerMainDiv>
      <BannerIcon>{props.icon}</BannerIcon>
      <BanerText>
        <StatusCardTitle>{props.title}</StatusCardTitle>
        <StatusCardSubtitle>{props.title}</StatusCardSubtitle>
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

const BannerDiv = styled.div`
  padding: 56px 20px 20px;
  background: linear-gradient(106.26deg, ${props => props.theme.accentLight1B} 5.73%, ${props => props.theme.accentLight1} 93.83%);
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
flex: 3;
`

const BannerMainDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`

const StatusCardTitle = styled.h2`
color: ${props => props.theme.text};
font-weight: normal;
margin: 10px 0;
line-height: 20px;
`
const StatusCardSubtitle = styled.p`
color: ${props => props.theme.lighterText};
font-weight: normal;
margin: 10px 0;
line-height: 20px;
`
const RightLink = styled.div`
margin: 10px 0;
line-height: 20px;
`