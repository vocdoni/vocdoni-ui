import React, { useState } from "react"
import styled from 'styled-components'

enum TooltipPosition {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right'
}

interface IQuestionProps {
  text?: string
}

export const HelpText = ({text}: IQuestionProps) => {
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false)

  const handleMouseEnter = () => {
    if (text) {
      setTooltipVisible(true)
    }
  }

  const handleMouseLeave = () => {
    if (text) {
      setTooltipVisible(false)
    }
  }
  return (
    <Container>
      <QuestionMark onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/>
      <Tooltip  visible={tooltipVisible}>{text}</Tooltip>
    </Container>
  )
}

const Container = styled.div`
  display: inline-block;
  position: relative;
  height: 16px;
  width: 16px;
`

const Tooltip = styled.div<{visible: boolean}>`
  visibility: ${({ visible }) => visible? 'visible': 'hidden'};
  opacity: ${({ visible }) => visible? '1': '0'};
  color: #865BFF;
  width: max-content;
  font-size: 14px;
  line-height: 14px;
  max-width: 250px;
  border-radius: 6px;
  background-color: #F3F4FF;
  transition: opacity 0.4s;
  position: absolute;
  padding: 8px;
  top: 0;
  left: 26px;
`

const QuestionMark = styled.span`
  display: inline-block;
  border-radius: 8px;
  height: 16px;
  width: 16px;
  font-size: 16px;
  line-height: 16px;
  background-color: #635BFF;
  margin-left: 6px;
  text-align: center;

  &:after {
    content: '?';
    color: ${({theme}) => theme.white};
    2px 3px 4px rgb(0 0 0 / 20%);
  }
`
