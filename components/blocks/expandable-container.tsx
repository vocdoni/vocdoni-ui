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
import { Col, Row, Spacer, Text } from '@components/elements-v2'


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
    <Row gutter='none'>
      {/* <Col xs={12}> */}
      <TextContainer
        ref={ref}
        isExpanded={isExpanded}
        {...props}
      >
        <Text size='sm' weight='light' color='dark-blue'>
          <MarkDownViewer content={props.children} />
        </Text>
      </TextContainer>
      {/* </Col> */}
      {height > lineHeight &&
        <Col xs={12}>
          <Spacer direction='vertical' size='xs' />
          <TextButton onClick={() => setIsExpanded(!isExpanded)} >
            {isExpanded ? props.buttonExpandedText : props.buttonText}
          </TextButton>
        </Col>
      }
    </Row>
  )
}
const getLineClamp = (props:IContainerProps) => {
  if(!props.isExpanded && props.lines) {
    return props.lines
  }
  return 'initial'
}
const getMaxHeight = (props:IContainerProps) => {
  if(!props.isExpanded && props.maxHeight) {
    return props.maxHeight
  }
  return undefined
}
const TextContainer = styled.div <IContainerProps>`
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: ${getLineClamp};
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: ${getMaxHeight};
  `
