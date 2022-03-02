import { Card, Col, Input, Row } from "@components/elements-v2"
import { Icon } from "@components/elements-v2/icons"
import { colorsV2 } from "@theme/colors-v2"
import { theme } from "@theme/global"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { DateTimePicker as RainbowDateTimePicker } from "react-rainbow-components"
import { DateTimePickerProps } from "react-rainbow-components/components/DateTimePicker"
import styled from "styled-components"

interface StyledRowProps {
  isFocused?: boolean
  diasbled?: boolean
  error?: boolean
}
export const DateTimePicker = (props: DateTimePickerProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const { i18n } = useTranslation()
  return (
    <StyledCard variant="outlined" isFocused={isFocused} diasbled={props.disabled} padding="6px 16px">
      <Row align="center" gutter="sm" wrap={false}>
        <StyledCol align="center" justify="center">
          <Icon name='calendar' size={16} color={props.disabled ? colorsV2.neutral[300] : theme.accent1} />
        </StyledCol>
        <Col xs={12} disableFlex>
          <StyledDateTimePicker
            locale={i18n.language}
            placeholder='here'
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </Col>
      </Row>
    </StyledCard>
  )
}

const getBorder = (props: StyledRowProps) => {
  if (props.isFocused) {
    return `2px solid ${theme.accent1}`
  }
  if (props.diasbled) {
    return `2px solid ${colorsV2.neutral[200]}`
  }
  if (props.error) {
    return `2px solid ${colorsV2.support.critical[500]}`
  }
  return `2px solid ${colorsV2.neutral[200]}`
}
const getBackground = (props: StyledRowProps) => {
  if (props.diasbled) {
    return colorsV2.neutral[50]
  }
  return colorsV2.neutral[0]
}



const StyledCard = styled(Card) <StyledRowProps>`
  border: ${getBorder};
  transition: 0.3s;
  box-sizing: border-box;
  border-radius: 8px;
  background: ${getBackground};
`
const StyledCol = styled(Col)`
  padding:8px;
  background: ${colorsV2.neutral[50]};
  border-radius: 4px;
`

const StyledDateTimePicker = styled(RainbowDateTimePicker)`
  input{
    height: auto;
    line-height:normal;
    font-size: 16px;
    font-family: Manrope;
    font-weight: 400;
    flex-grow: 1;
    padding: 0;
    margin: 0;
    line-height:auto;
    border: none;
    color: ${theme.blueText};
    &:focus {
      border: none;
      outline: none;
      box-shadow: none;
    }
    &:disabled {
      border: none;
      outline: none;
      box-shadow: none;
      background: ${colorsV2.neutral[50]};
    }
    &::placeholder {
      font-size: 16px;
      line-height:normal;
      font-family: Manrope;
      font-weight: 400;
      color: ${colorsV2.neutral[300]};
    }
  }
  span {
    display:none;
  }
`
