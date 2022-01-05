import React, { ReactNode } from "react"
import Spinner, { SpinnerProps } from 'react-rainbow-components/components/Spinner'
import Link from "next/link"
import styled from "styled-components"
import { hexToRgbA } from "../../lib/util"
import { theme } from "../../theme"
import { colors } from "theme/colors"

export enum ButtonColor {
    Positive = "positive",
    Negative = "negative"
}

export enum LinkTarget {
    Blank = '_blank',
    Self = '_self'
}

type ButtonProps = {
    positive?: boolean,
    negative?: boolean,
    disabled?: boolean,
    large?: boolean,
    small?: boolean,
    verticalAlign?: boolean,
    omnium?: boolean,
    /** Draws a gray border only in default buttons */
    border?: boolean,
    wide?: boolean,
    width?: number,
    justify?: JustifyContent,
    /** Text color to use (either a HEX color or "accent1" "accent2") */
    color?: ButtonColor | string,
    borderColor?: ButtonColor | string,
    icon?: React.ReactNode,
    children?: React.ReactNode
    href?: string
    target?: LinkTarget
    spinner?: boolean
    onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}

export const Button = ({ disabled, positive, negative, color, href, target, onClick, width, icon, wide, border, borderColor, justify, verticalAlign, large, small, spinner, children, omnium }: ButtonProps) => {
    let component: JSX.Element
    const getButtonText = (spinnerVariant: SpinnerProps['variant'] = 'brand'): ReactNode => (
        spinner ?
            (<SpinnerContainer>
                <Spinner size="xx-small" type="arc" variant={spinnerVariant} />
            </SpinnerContainer>):
            children
    )

    if (disabled) {
        return <DisabledButton wide={wide} large={large} small={small} width={width} onClick={ev => (onClick && !disabled) ? onClick(ev) : null}>
            {icon ?
                <ButtonContent color={theme.darkLightFg} justify={justify}>{icon}&nbsp; { getButtonText() }</ButtonContent> :
                <ButtonContent color={theme.darkLightFg} verticalAlign={verticalAlign} justify={justify}>{ getButtonText() }</ButtonContent>
            }
        </DisabledButton>
    }

    if (positive) {
        component = <PositiveButton wide={wide} large={large} small={small} width={width} onClick={ev => (onClick && !disabled) ? onClick(ev) : null}>
            {icon ?
                <ButtonContent color={theme.white} justify={justify}>{icon}&nbsp;{getButtonText('inverse')}</ButtonContent> :
                <ButtonContent color={theme.white} verticalAlign={verticalAlign} justify={justify}>{getButtonText('inverse')}</ButtonContent>
            }
        </PositiveButton>
    }
    else if (negative) {
        component = <NegativeButton wide={wide} large={large} small={small} width={width} onClick={ev => (onClick && !disabled) ? onClick(ev) : null}>
            {icon ?
                <ButtonContent color={theme.white} justify={justify}>{icon}&nbsp;{getButtonText('inverse')}</ButtonContent> :
                <ButtonContent color={theme.white} verticalAlign={verticalAlign} justify={justify}>{getButtonText('inverse')}</ButtonContent>
            }
        </NegativeButton>
    }
    else {
        component = <DefaultButton omnium={omnium} wide={wide} border={border} borderColor={borderColor} large={large} small={small} width={width} onClick={ev => (onClick && !disabled) ? onClick(ev) : null}>
            {icon ?
                <ButtonContent color={color} justify={justify}>{icon}&nbsp;{getButtonText('inverse')}</ButtonContent> :
                <ButtonContent color={color} verticalAlign={verticalAlign} justify={justify}>{getButtonText('inverse')}</ButtonContent>
            }
        </DefaultButton>
    }

    if (href) {
        return <Link href={href}>
            <MyAnchor target={target || LinkTarget.Self} href={href}>{component}</MyAnchor>
        </Link>
    }
    return component
}

export const SquareButton = ({ icon, children, width, disabled, onClick }: ButtonProps) => (
    <Button onClick={onClick} disabled={disabled} width={width} border verticalAlign>
        <SquareButtonIconContainer>{icon}</SquareButtonIconContainer>
        {children}
    </Button>
)

export const BaseButton = styled.div<{ wide?: boolean, large?: boolean, small?: boolean, width?: number, border?: boolean, omnium?: boolean, borderColor?: ButtonColor | string }>`
${props => props.wide ? "" : "display: inline-block;"}
${props => props.width != undefined ? "width: " + props.width + "px;" : ""}
${props => props.large ? "padding: 13px 25px;" :
        props.small ? "padding: 8px 15px;" :
            "padding: 11px 20px;"}

${props => props.large ? "font-size: 125%;" :
        props.small ? "font-size: 85%;" : ""}

    background: ${props => props.theme.lightBg};
    box-shadow: 0px 6px 6px rgba(180, 193, 228, 0.35);
    border-radius: 8px;
    white-space: nowrap;
    user-select: none;
    box-sizing: border-box;
    font-weight: 600;

    @media ${({theme})  => theme.screenMax.mobileL } {
        white-space: normal;
        padding:  ${({ border, small }) => { 
            const padded = border ? 2 : 0;
            const topBottomPaddingBase = 16
            const leftRightPaddingBase = 18
            const reducerBase = small ? 2 : 1

            return `${(topBottomPaddingBase - padded)/ reducerBase}px ${(leftRightPaddingBase - padded)/ reducerBase}px !important`;
        }};
        line-height: 20px !important;
        font-size:  ${({ border, small }) => small? '12px': '16px'} !important;
    }
`

const DisabledButton = styled(BaseButton)`
    cursor: no-drop;
`

const DefaultButton = styled(BaseButton)`
    cursor: pointer;
    ${({ border, borderColor, theme }) => border ? "border: 2px solid " + (borderColor? borderColor: theme.lightBorder)+ ";" : ""}
    
    background: ${({omnium}) => omnium ? '#f13e3e': '#fff'};

    // Compensate 2px border (if applicable)
    ${({ large, small, border }) =>
            large ? (border ? "padding: 11px 23px;" : "padding: 13px 25px;") :
                small ? (border ? "padding: 6px 13px;" : "padding: 8px 15px;") :
                    (border ? "padding: 9px 18px;" : "padding: 11px 20px;")}

    &:hover {
        background-color: ${({omnium}) => omnium ? '#e9501d': '#F6F9FC'};
    }
    &:active {
        background-color: ${({omnium}) => omnium ? '#e9501d': '#EFF1F7'};
    }
`

const SpinnerContainer = styled.div`
    position: relative;
    height: 16px;
`
export const PositiveButton = styled(BaseButton)`
    cursor: pointer;

    background: linear-gradient(106.26deg, ${props => hexToRgbA(props.theme.accent1B)} 5.73%, ${props => hexToRgbA(props.theme.accent1)} 93.83%);

    &:hover {
        background: linear-gradient(106.26deg, ${props => hexToRgbA(props.theme.accent1B, 0.9)} 5.73%, ${props => hexToRgbA(props.theme.accent1, 0.9)} 93.83%);
    }
    &:active {
        background: linear-gradient(106.26deg, ${props => hexToRgbA(props.theme.accent1B, 0.8)} 5.73%, ${props => hexToRgbA(props.theme.accent1, 0.8)} 93.83%);
    }
`

const NegativeButton = styled(BaseButton)`
    cursor: pointer;

    background: linear-gradient(106.26deg, ${props => hexToRgbA(props.theme.accent2B)} 5.73%, ${props => hexToRgbA(props.theme.accent2)} 93.83%) !important;

    &:hover {
        background: linear-gradient(106.26deg, ${props => hexToRgbA(props.theme.accent2B, 0.9)} 5.73%, ${props => hexToRgbA(props.theme.accent2, 0.9)} 93.83%);
    }
    &:active {
        background: linear-gradient(106.26deg, ${props => hexToRgbA(props.theme.accent2B, 0.8)} 5.73%, ${props => hexToRgbA(props.theme.accent2, 0.8)} 93.83%);
    }
`

export enum JustifyContent {
    Left = 'left',
    Right = 'right',
    Center = 'center'
}

const ButtonContent = styled.div<{ color?: ButtonProps["color"], justify?: JustifyContent, verticalAlign?: boolean}>`
    display: flex;
    flex-direction: ${({verticalAlign}) => verticalAlign? 'column': 'row'};
    justify-content: ${({justify}) => justify? justify: JustifyContent.Center};
    align-items: center;
    ${props => props.color == "positive" ? "color: " + props.theme.textAccent1 + ";" :
            props.color == "negative" ? "color: " + props.theme.textAccent2 + ";" :
                !!props.color ? "color: " + props.color + ";" :
                    ""}
`

const MyAnchor = styled.a`
    color: unset;
`

const SquareButtonIconContainer = styled.div`
  height: 66px;
  width: 66px;
  margin: 30px auto 16px;

  & > img {
    width: 100%;
  }
`

export const LargeButtonText = styled.p`
  color: ${colors.blueText};
  font-size: 18px;
  font-weight: 500;
  margin: 0 20px;
`
