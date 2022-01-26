import { useRef, useLayoutEffect } from 'react'
import { TextButton } from '@components/elements-v2/text-button'
import { colors } from '@theme/colors'
import { initial, set } from 'lodash'
import { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { CalendarCard } from './calendar-card'
import { MarkDownViewer } from './mark-down-viewer'
import { When } from 'react-if'
import { Col, Row, Spacer, Text, Button } from '@components/elements-v2'


interface ExpandableContainerProps {
  children: ReactNode
  lines?: number
  maxHeight?: number | string
  buttonText: string
  buttonExpandedText: string
}

interface IContainerProps extends ExpandableContainerProps {
  isExpanded: boolean
}

export const ExpandableContainer = (props: ExpandableContainerProps) => {
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
    <Row gutter='xs'>
      {/* <Col xs={12}> */}
      <TextContainer
        ref={ref}
        isExpanded={isExpanded}
        {...props}
      >
        <Text size='sm' weight='light' color='dark-blue'>
          {props.children}
          {/* <MarkDownViewer content={props.children} /> */}
        </Text>
      </TextContainer>
      {/* </Col> */}
      {height > lineHeight &&
        <Col justify='start'>
          <Button onClick={() => setIsExpanded(!isExpanded)} variant='text' >
            {isExpanded ? props.buttonExpandedText : props.buttonText}
          </Button>
        </Col>
      }
    </Row>
  )
}
const getLineClamp = (props: IContainerProps) => {
  if (!props.isExpanded && props.lines) {
    return props.lines
  }
  return 'initial'
}
const getMaxHeight = (props: IContainerProps) => {
  if (!props.isExpanded && props.maxHeight) {
    return props.maxHeight
  }
  return undefined
}
const getTransition = (props: IContainerProps) => {
  if (!props.isExpanded) {
    return 'max-height 0.15s ease-out'
  }
  return 'max-height 0.25s ease-in'
}
const TextContainer = styled.div <IContainerProps>`
  margin-bottom: 8px;
  display: -webkit-box;
  transition: ${getTransition};
  -webkit-line-clamp: ${getLineClamp};
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: ${getMaxHeight};
  `
