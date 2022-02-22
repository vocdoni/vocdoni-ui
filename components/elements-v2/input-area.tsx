import { colorsV2 } from "@theme/colors-v2";
import { theme } from "@theme/global";
import { useState } from "react";
import styled from "styled-components";
import { Col, Row, IRowProps, Text } from ".";
import { AvailableIcons, Icon } from "./icons";

interface InputAreaProps extends React.ComponentPropsWithoutRef<'textarea'> {
  leftIcon?: AvailableIcons
  rightIcon?: AvailableIcons
  error?: string
  disabled?: boolean
  label?: string
  hideMesages?: boolean
}
interface StyledRowProps extends IRowProps {
  focus?: boolean
  error?: string
  disabled?: boolean
}
export const InputArea = (props: InputAreaProps) => {
  const [focus, setFocus] = useState(false)
  const handleOnFocus = () => {
    setFocus(true)
  }
  const handleOnBlur = () => {
    setFocus(false)
  }
  return (
    <Row gutter="2xs">
      <Col xs={12}>
        <Row gutter={props.label ? 'xs' : 'none'}>
          {props.label &&
            <Col xs={12}>
              <Text weight="semi-bold" color="dark-blue" size="sm">
                {props.label}
              </Text>
            </Col>
          }
          <Col xs={12}>
            <StyledRow
              gutter='sm'
              wrap={false}
              align='center'
              focus={focus}
              error={props.error}
              disabled={props.disabled}
            >
              {props.leftIcon &&
                <Col>
                  <Icon size={16} color={colorsV2.neutral[300]} name={props.leftIcon} />
                </Col>
              }
              <StyledCol xs='auto'>
                <StyledInput rows={6} onBlur={handleOnBlur} onFocus={handleOnFocus} {...props} />
              </StyledCol>
              {props.rightIcon &&
                <Col>
                  <Icon size={16} color={colorsV2.neutral[300]} name={props.leftIcon} />
                </Col>
              }
            </StyledRow>
          </Col>
        </Row>
      </Col>
      {(props.error && !props.hideMesages) &&
        <Col xs={12}>
          <Text weight="semi-bold" color="error" size="xs">
            {props.error}
          </Text>
        </Col>
      }
    </Row >
  )
}
const StyledCol = styled(Col)`
  flex-grow: 1;
`
export const StyledInput = styled.textarea`
  width: 100%;
  outline: none;
  resize: none;
  padding: 0;
  margin: 0;
  border: none;
  font-size: 16;
  font-family: Manrope;
  font-weight: 500;
  color: ${theme.blueText};
  &:focus{
    outline:none;
  }
  ::placeholder{
    font-weight: 500;
    border:none;
    color: ${colorsV2.neutral[400]};
  }
`

const cosmeticProps = ['focus', 'disabled', 'error']
const styledConfig = {
  shouldForwardProp: (prop) => !cosmeticProps.includes(prop)
}
export const StyledRow = styled(Row).withConfig(styledConfig) <StyledRowProps>`
  margin: 0;
  height: 144px;
  opacity: ${getOpacity};
  padding: 16px 12px;
  border: ${getBorder};
  transition: 0.3s;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: inset 0px 2px 3px rgba(180, 193, 228, 0.35);
`

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
