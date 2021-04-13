import styled from "styled-components"
import Link from "next/link"
import { Column, ColumnProps } from "./grid"

type CardProps = ColumnProps

type StatusCardProps = ColumnProps & {
  title: string,
  rightText?: string,
  href?: string
}

export const PageCard = styled.div`
background-color: ${({ theme }) => theme.white};
padding: 32px;
border-radius: 16px;
`

export const Card = ({ span, sm, md, lg, xl, ...props }: CardProps) => <Column {...{ span, sm, md, lg, xl }}>
  <CardDiv>
    {props.children}
  </CardDiv>
</Column>

export const StatusCard = ({ span, sm, md, lg, xl, ...props }: StatusCardProps) => <Column {...{ span, sm, md, lg, xl }}>
  <CardDiv>
    <TopDiv>
      <StatusCardTitle>{props.title}</StatusCardTitle>
      {props.rightText ?
        props.href ?
          <Link href={props.href}><a><RightLink>{props.rightText}</RightLink></a></Link> :
          <RightLink>{props.rightText}</RightLink> :
        null
      }
    </TopDiv>
    {props.children}
  </CardDiv>
</Column>

// Styles

const CardDiv = styled.div`
  padding: 11px 20px;
  background: ${props => props.theme.white};
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
  border-radius: 16px;
`

const TopDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const StatusCardTitle = styled.h5`
color: ${props => props.theme.darkLightFg};
font-weight: normal;
margin: 10px 0;
line-height: 20px;
`
const RightLink = styled.div`
margin: 10px 0;
line-height: 20px;
`