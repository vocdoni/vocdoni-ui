import { colorsV2 } from "@theme/colors-v2"
import { theme } from "@theme/global"
import { ReactNode, useState } from "react"
import styled from "styled-components"
import { AvailableIcons } from "./icons"
import { Card, Col, Row } from "."


export interface InputProps {
  icon?: AvailableIcons | ReactNode
  placeholder?: string
  onBlur?: () => void
  onFocus?: () => void
}

interface StyledRowProps {
  isFocused?: boolean
}
export const Input = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const handleOnFocus = () => {
    setIsFocused(true)
    props.onFocus()
  }
  const handleOnBlur = () => {
    setIsFocused(false)
    props.onBlur()
  }
  return (
    <StyledRow isFocused={isFocused} gutter="none">
      <Col xs={11}>
        <div>
          <StyledInput
            placeholder={props.placeholder}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
        </div>
      </Col>
    </StyledRow>
  )
}

const getBorder = (props: StyledRowProps) => {
  if (props.isFocused) {
    return `2px solid ${theme.accent1}`
  }
  return `2px solid ${colorsV2.neutral[200]}`

}

const StyledRow = styled(Row) <StyledRowProps>`
  border: ${getBorder};
  transition: 0.3s;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 8px 12px;

`
const StyledInput = styled.input`
  outline: none;
  display: flex;
  flex-grow: 1;
  border: none;
  font-size: 16px;
  font-family: Manrope;
  font-weight: 400;
  color: ${theme.blueText};
  &::placeholder {
    color: ${colorsV2.neutral[300]};
  }
`


