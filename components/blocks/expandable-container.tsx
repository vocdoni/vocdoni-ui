import { TextButton } from '@components/elements-v2/text-button'
import { Button } from '@components/elements/button'
import { colors } from '@theme/colors'
import { initial } from 'lodash'
import { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { CalendarCard } from './calendar-card'
import { MarkDownViewer } from './mark-down-viewer'


interface IExpandibleContainerProps {
  children: ReactNode
  lines?: number
  maxHeight?: number | string
  buttonText: string
  buttonExpandedText: string
}

interface IContainerProps {
  lines?: number
  maxHeight?: number | string
  isExpanded: boolean
}

export const ExpandableContainer = (props: IExpandibleContainerProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div>
      <TextContainer
        isExpanded={isExpanded}
        lines={props.lines}
        maxHeight={props.maxHeight}
      >
        <Text>
          <MarkDownViewer content={props.children} />
        </Text>
      </TextContainer>
      <TextButton onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? props.buttonExpandedText : props.buttonText}
      </TextButton>
    </div>
  )
}

const Text = styled.span`
  font-weight:400;
  font-size: 16px;
  font-family: Manrope;
  color: ${colors.blueText};
  line-height: 22px;
`

const TextContainer = styled.div <IContainerProps>`
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: ${({ lines, isExpanded }) => lines && !isExpanded ? lines : 'initial'};
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: ${({ maxHeight, isExpanded, lines }) => maxHeight && !isExpanded ? maxHeight : undefined};
  `
