import styled from "styled-components";
import { colorsV2 } from "@theme/colors-v2";
import { theme } from "@theme/global";
import { HTMLInputTypeAttribute, useState } from "react";
import { Col, Row, IRowProps, Text, TextProps } from ".";
import { AvailableIcons, Icon } from "./icons";
import { selectNodeBackward } from "@tiptap/core/dist/packages/core/src/commands/selectNodeBackward";

export interface SelectProps {
  options: Option[]
  leftIcon?: AvailableIcons
  rightIcon?: AvailableIcons
  error?: string
  label?: string
  defaultValue?: Option
  placeholder?: string
  disabled?: boolean
  onChange: (Option) => void
}
type Option = {
  text: string
  value: string | number
}
interface StyledRowProps extends IRowProps {
  focus?: boolean
  error?: string
  disabled?: boolean
}
interface OptionProps extends TextProps {
  onClick?: () => void
  selected: boolean
}

export const Select = (props: SelectProps) => {
  const [focus, setFocus] = useState(false)
  const [selectedOption, setSelectedOption] = useState<Option>(props.defaultValue)

  const handleOnFocus = () => {
    setFocus(true)
  }
  const handleOnBlur = () => {
    setTimeout(() => {
      setFocus(false)
    }, 250)
  }

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option)
    props.onChange(option)
  }

  return (
    <Row gutter="2xs">
      <Col xs={12}>
        {/* LABEL */}
        <Row gutter='xs'>
          {props.label &&
            <Col xs={12}>
              <Text weight="semi-bold" color="dark-blue" size="sm">
                {props.label}
              </Text>
            </Col>
          }
          <Col xs={12}>
            {/* INPUT */}
            <StyledRow
              gutter='sm'
              wrap={false}
              align='center'
              focus={focus}
              error={props.error}
              disabled={props.disabled}
            >
              {/* LEFT ICON */}
              {props.leftIcon &&
                <Col>
                  <Icon size={16} color={colorsV2.neutral[300]} name={props.leftIcon} />
                </Col>
              }
              {/* INPUT */}
              <GrowCol xs='auto'>
                <StyledInput
                  value={selectedOption.text}
                  readOnly
                  placeholder={props.placeholder}
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                />
              </GrowCol>

              {/* CHEVRON */}
              <Col>
                <Icon size={16} color={colorsV2.neutral[300]} name={props.rightIcon || 'chevron-down'} />
              </Col>
            </StyledRow>
          </Col>
          {/* OPTIONS */}
          {focus &&
            <OptionsContainer xs={12}>
              <Row gutter="md">
                {props.options.map((option, i) => (
                  <Col xs={12} key={i}>
                    <Option
                      size='sm'
                      selected={option.value === selectedOption.value}
                      onClick={() => handleOptionClick(option)}
                    >
                      {option.text}
                    </Option>
                  </Col>
                ))
                }
              </Row>
            </OptionsContainer>
          }
        </Row>
      </Col>
    </Row >
  )
}

const StyledInput = styled.input`
cursor: pointer;
border: none;
background: white;
width: 100%;
outline: none;
padding: 0;
margin: 0;
border: none;
font-size: 16;
font-family: Manrope;
font-weight: 500;
color: ${theme.blueText};
::placeholder{
  font-weight: 500;
  border:none;
  color: ${colorsV2.neutral[400]};
}
`
const Option = styled(Text) <OptionProps>`
cursor: pointer;
transition: 0.3s;
font-weight: ${getOptionFontWeight};
color: ${getOptionColor};
&:hover{
  color: ${theme.accent1};
}
`
const OptionsContainer = styled(Col)`
margin-top: 8px;
border: 2px solid ${colorsV2.neutral[200]};
box-sizing: border-box;
box-shadow: 0px 6px 25px rgba(65, 70, 85, 0.05);
border-radius: 8px;
background-color: white;
right: 0;
left: 0;
z-index: 3;
padding: 24px;
transition: 0.3s;
`
const GrowCol = styled(Col)`
  flex-grow: 1;
`

const cosmeticProps = ['focus', 'disabled', 'error']
const styledConfig = {
  shouldForwardProp: (prop) => !cosmeticProps.includes(prop)
}
export const StyledRow = styled(Row).withConfig(styledConfig) <StyledRowProps>`
  margin: 0;
  opacity: ${getOpacity};
  height: 48px;
  padding: 16px 12px;
  border: ${getBorder};
  transition: 0.3s;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: inset 0px 2px 3px rgba(180, 193, 228, 0.35);
`

function getOptionFontWeight(props: OptionProps) {
  if (props.selected) {
    return 600
  }
  return 500
}
function getOptionColor(props: OptionProps) {
  if (props.selected) {
    return theme.accent1
  }
  return theme.blueText
}

function getOpacity(props: StyledRowProps) {
  if (props.disabled) {
    return 0.35
  }
  return 1
}

function getBorder(props: StyledRowProps) {
  if (props.error) {
    return `2px solid ${colorsV2.support.critical[500]}`
  }
  if (props.focus) {
    return `2px solid ${theme.accent1}`
  }
  return `2px solid ${colorsV2.neutral[200]}`
}

