import { useRef, useLayoutEffect } from 'react'
import { TextButton } from '@components/elements-v2/text-button'
import { Button } from '@components/elements/button'
import { colors } from '@theme/colors'
import { initial, set } from 'lodash'
import { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { CalendarCard } from './calendar-card'
import { MarkDownViewer } from './mark-down-viewer'
import { When } from 'react-if'


interface IExpandableContainerProps {
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

export const ExpandableContainer = (props: IExpandableContainerProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  const ref = useRef()
  // Hide the button if the content height is less than
  // props.lines, assuming each line has a height of 22
  const lineHeight = 22 * props.lines
  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight)
    }
  })
  return (
    <div>
      <TextContainer
        ref={ref}
        isExpanded={isExpanded}
        lines={props.lines}
        maxHeight={props.maxHeight}
      >
        <Text>
          <MarkDownViewer content={props.children} />
        </Text>
      </TextContainer>
      <When condition={height > lineHeight}>
        <TextButton onClick={() => setIsExpanded(!isExpanded)} >
          {isExpanded ? props.buttonExpandedText : props.buttonText}
        </TextButton>
      </When>
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
