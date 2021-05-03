import styled from 'styled-components'
import Link from 'next/link'
import { Column, ColumnProps } from './grid'
import { Skeleton } from './skeleton'

type CardProps = ColumnProps & {
  border?: boolean
}

type StatusCardProps = ColumnProps & {
  title: string
  rightText?: string
  href?: string
  skeleton?: boolean
}

export const PageCard = styled.div`
  background-color: ${({ theme }) => theme.white};
  padding: 32px;
  border-radius: 16px;
`

export const PageCardHeader = styled.div`
  margin: -32px -32px 20px;
  max-height: 240px;
  border-radius: 16px 16px 0 0;
  overflow: hidden;

  & > img {
    width: 100%;
  }
`

export const Card = ({ span, sm, md, lg, xl, border, ...props }: CardProps) => (
  <Column {...{ span, sm, md, lg, xl }}>
    <CardDiv border>{props.children}</CardDiv>
  </Column>
)

export const StatusCard = ({
  span,
  sm,
  md,
  lg,
  xl,
  skeleton,
  ...props
}: StatusCardProps) => (
  <Column {...{ span, sm, md, lg, xl }}>
    <CardDiv>
      {skeleton ? (
        <Skeleton />
      ) : (
        <>
          <TopDiv>
            <StatusCardTitle>{props.title}</StatusCardTitle>
            {props.rightText ? (
              props.href ? (
                <Link href={props.href}>
                  <a>
                    <RightLink>{props.rightText}</RightLink>
                  </a>
                </Link>
              ) : (
                <RightLink>{props.rightText}</RightLink>
              )
            ) : null}
          </TopDiv>
          {props.children}
        </>
      )}
    </CardDiv>
  </Column>
)

// Styles

const CardDiv = styled.div<{border?: boolean}>`
  padding: 20px;
  background: ${(props) => props.theme.white};
  border: ${({theme, border}) => border? `solid 2px ${theme.lightBorder}`: 'none'};
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
  border-radius: 16px;
`

const TopDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const StatusCardTitle = styled.h5`
  color: ${(props) => props.theme.darkLightFg};
  font-weight: normal;
  margin: 10px 0;
  line-height: 20px;
`
const RightLink = styled.div`
  margin: 10px 0;
  line-height: 20px;
`
