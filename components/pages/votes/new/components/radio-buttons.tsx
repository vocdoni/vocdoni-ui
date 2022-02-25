import { Col, Row, Text } from "@components/elements-v2"
import { colorsV2 } from "@theme/colors-v2"
import { theme } from "@theme/global"
import { useState } from "react"
import styled from "styled-components"

interface RadioButtonProps {
  label?: string
  value: any
  checked: boolean
  onCheck?: (any) => void
}
export interface RadioButtonGroupProps {
  multiple?: boolean
  optional?: boolean
  options: RadioButtonOptions[]
  value?: any
  onChange?: (any) => void
}

export interface RadioButtonOptions {
  label?: string
  value: any
}

interface StyledRowProps {
  checked: boolean
}

const RadioButton = (props: RadioButtonProps) => {
  return (
    <StyledDiv
      onClick={() => props.onCheck(props.value)}
      checked={props.checked}
    >
      <Row
        align="center"
        justify="center"
        gutter="md"
      >
        <Col xs="auto">
          <CheckmarkContainer checked={props.checked} align='center' justify='center' gutter="none">
            {props.checked &&
              <Checkmark />
            }
          </CheckmarkContainer>
        </Col>
        <Col>
          <Text
            size="sm"
            weight={props.checked ? 'bold' : 'regular'}
            color={props.checked ? 'primary' : 'dark-blue'}
          >
            {props.label}
          </Text>
        </Col>
      </Row>
    </StyledDiv>
  )
}
export const RadioButtonGroup = (props: RadioButtonGroupProps) => {
  const handleOnCheck = async (e: any) => {
    // check if is array
    let newValue
    if (Array.isArray(props.value)) {
      // if is array check if the array incluthes the value
      if (props.value.includes(e)) {
        // if its included delete it
        const filtered = props.value.filter((v, i, a) => {
          return v !== e
        })
        if (filtered.length === 0 && !props.optional) {
          newValue = props.value
        } else {
          newValue = filtered
        }
        // set value to filtered
      } else {
        // add it to the array
        newValue = [...props.value, e]
      }
    } else {
      // set to null
      if (e === props.value && props.optional) {
        newValue = null
        // set to value
      } else {
        newValue = e
      }
    }
    props.onChange(newValue)
  }
  return (
    <Row gutter="xs">
      {
        props.options.map((option) => (
          <Col>
            <RadioButton
              value={option.value}
              label={option.label}
              // If is multiple use array includes eles use ===
              checked={props.multiple ? props.value.includes(option.value) : option.value === props.value}
              onCheck={handleOnCheck}
            />
          </Col>
        ))
      }
    </Row>
  )
}

const getBorderColor = (props: StyledRowProps) => {
  if (props.checked) {
    return theme.accent1
  }
  return colorsV2.neutral[200]
}

const StyledDiv = styled.div<StyledRowProps>`
  border: solid 2px ${getBorderColor};
  transition: 0.3s;
  padding: 13px;
  border-radius: 8px;
  box-sizing: border-box;
  cursor: pointer;
`
const CheckmarkContainer = styled(Row) <StyledRowProps>`
  height: 16px;
  width: 16px;
  background-color: transparent;
  border-radius: 50%;
  border: 2px solid ${getBorderColor};
  transition: 0.3s;
  box-sizing: border-box;
`
const Checkmark = styled(Col)`
  border-radius: 50%;
  background: ${theme.accent1};
  z-index: 9;
  height: 8px;
  width: 8px;
  transition: 0.3s;
  box-sizing: border-box;
`
