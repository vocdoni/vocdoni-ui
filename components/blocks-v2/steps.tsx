
import { Col, Row, Spacer, Text } from '@components/elements-v2'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { NoSubstitutionTemplateLiteral } from 'typescript'

const DOT_SIZE_SM = 11
const DOT_SIZE_LG = 31
const TOP_ROW_HEIGHT = 32
const LINE_WIDTH = 2

export interface StepsProps {
  steps: StepObject[]
  activeIndex: number
  showProgress?: boolean
}
interface StepObject {
  label: string
  title?: string
  subtitle?: string
}
interface StepProps {
  activeIndex: number
  isLast: boolean
  index: number
  showProgess: boolean
  step: StepObject
}


export const Steps = (props: StepsProps) => (
  <StepsContainer>
    {
      props.steps.map((step, index) => {
        return (
          <Step
            key={index}
            index={index}
            activeIndex={props.activeIndex}
            isLast={index === (props.steps.length - 1)}
            showProgess={props.showProgress}
            step={step}
          />
        )
      })
    }
  </StepsContainer>
)

const Step = (props: StepProps) => {
  const done = props.index <= props.activeIndex
  const active = props.index == props.activeIndex
  let doneLeftLine = false, doneRightLine = false

  if (props.index < props.activeIndex) {
    doneLeftLine = true
    doneRightLine = true
  }
  else if (active) {
    doneLeftLine = true
  }

  return <StepDiv>
    {props.showProgess &&
      <>
        <StepTop>
          {props.index > 0 &&
            <LineLeft done={doneLeftLine} />
          }
          {active ?
            <>
              <Dot done={done} />
              <DotActive />
            </> :
            <Dot done={done} />
          }
          {!props.isLast && <LineRight done={doneRightLine} />}
        </StepTop>
        <Row gutter='2xs' justify='center'>
          <Col xs={8} justify='center'>
            <Text color={active ? 'primary' : 'dark-gray'} size='sm' align='center'>
              {props.step.label}
            </Text>
          </Col>
          {props.step.title &&
            <Col xs={8} justify='center'>
              <Text size='sm' color='dark-gray' weight='bold' align='center'>
                {props.step.title}
              </Text>
            </Col>
          }
          {(props.step.title && props.step.subtitle) &&
            <Col xs={8} justify='center'>
              <Text size='xs' color='dark-blue' align='center'>
                {props.step.subtitle}
              </Text>
            </Col>
          }
        </Row>
      </>
    }
  </StepDiv >
}

// HELPERS

const Dot2 = styled.div<{ done?: boolean }>`
      z-index: 20;
      background-color: ${({ theme, done }) => done ? theme.accent1 : theme.accent1Grayed};
      width: ${DOT_SIZE_SM}px;
      height: ${DOT_SIZE_SM}px;
      border-radius: 50%;
      align: center;
      `

const StepsContainer = styled.div`
      display: flex;
      user-select: none;
      margin-bottom: 16px;
      `

const StepDiv = styled.div`
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      `

const StepTop = styled.div`
      width: 100%;
      height: ${TOP_ROW_HEIGHT}px;
      position: relative;
      margin-bottom: 10px;
      `
const StepText = styled.div<{ active: boolean }>`
      color: ${({ theme, active }) => active ? theme.accent1 : theme.accent1Grayed};
      `
const LineLeft = styled.div<{ done: boolean }>`
      z-index: 10;
      position: absolute;
      top: calc(50% - ${LINE_WIDTH / 2}px);
      left: 0;
      right: 50%;
      height: ${LINE_WIDTH}px;
      background: ${({ theme, done }) => done ? theme.accent1 : theme.accent1Grayed};
      `
const LineRight = styled.div<{ done: boolean }>`
      z-index: 10;
      position: absolute;
      top: calc(50% - ${LINE_WIDTH / 2}px);
      left: 50%;
      right: 0;
      height: ${LINE_WIDTH}px;
      background: ${({ theme, done }) => done ? theme.accent1 : theme.accent1Grayed};
      `

const Dot = styled.div<{ done?: boolean }>`
        z-index: 20;
        position: absolute;
        background-color: ${({ theme, done }) => done ? theme.accent1 : theme.accent1Grayed};
        top: calc(50% - ${DOT_SIZE_SM / 2}px);
        left: calc(50% - ${DOT_SIZE_SM / 2}px);
        width: ${DOT_SIZE_SM}px;
        height: ${DOT_SIZE_SM}px;
        border-radius: 50%;
        `

const DotActive = styled(Dot)`
        z-index: 15;
        background-color: ${({ theme }) => theme.accent1B};
        top: calc(50% - ${DOT_SIZE_LG / 2}px);
        left: calc(50% - ${DOT_SIZE_LG / 2}px);
        width: ${DOT_SIZE_LG}px;
        height: ${DOT_SIZE_LG}px;

        animation-name: pulse;
        animation-duration: 2s;
        // animation-timing-function: ease-in-out;
        animation-timing-function: linear;
        animation-iteration-count: infinite;

        @keyframes pulse {
          0 % {
            opacity: 0.5;
            transform: scale(70 %);
          }
  100% {
          opacity: 0.2;
        transform: scale(110%);
  }
}
        `
