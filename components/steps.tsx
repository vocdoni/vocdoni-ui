import { ReactNode } from 'react'
import styled from 'styled-components'

const DOT_SIZE_SM = 11
const DOT_SIZE_LG = 31
const TOP_ROW_HEIGHT = 32
const LINE_WIDTH = 2

export const Steps = ({ steps, activeIdx }: { steps: string[], activeIdx: number }) => (
  <StepsContainer>
    {
      steps.map((stepText, idx) => {
        return <Step key={idx} idx={idx} activeIdx={activeIdx} isLast={idx == steps.length - 1}>{stepText}</Step>
      })
    }
  </StepsContainer>
)

const Step = ({ children, idx, activeIdx, isLast }: { children: ReactNode, idx: number, activeIdx: number, isLast: boolean }) => {
  const done = idx <= activeIdx
  const active = activeIdx == idx
  let doneLeftLine = false, doneRightLine = false

  if (idx < activeIdx) {
    doneLeftLine = true
    doneRightLine = true
  }
  else if (active) {
    doneLeftLine = true
  }

  return <StepDiv>
    <StepTop>
      {idx > 0 ? <LineLeft done={doneLeftLine} /> : null}
      {active ? <><Dot done={done} /><DotActive /></> : <Dot done={done} />}
      {isLast ? null : <LineRight done={doneRightLine} />}
    </StepTop>
    <StepText active={active || done}>{children}</StepText>
  </StepDiv>
}

// HELPERS

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
  0% {
    opacity: 0.5;
    transform: scale(70%);
  }
  100% {
    opacity: 0.2;
    transform: scale(110%);
  }
}
`
