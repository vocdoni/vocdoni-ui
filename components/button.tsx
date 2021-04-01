import Link from "next/link"
import React from "react"
import styled from "styled-components"
import { hexToRgbA } from "../lib/util"
import { theme } from "../theme"

type ButtonProps = {
    positive?: boolean,
    negative?: boolean,
    disabled?: boolean,
    large?: boolean,
    small?: boolean,
    /** Draws a gray border only in default buttons */
    border?: boolean,
    wide?: boolean,
    width?: number,
    /** Text color to use (either a HEX color or "accent1" "accent2") */
    color?: "positive" | "negative" | string,
    icon?: React.ReactNode,
    children?: React.ReactNode
    href?: string
    onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

function Button({ disabled, positive, negative, color, href, onClick, width, icon, wide, border, large, small, children }: ButtonProps) {
    let component: JSX.Element

    if (disabled) {
        return <BaseButton wide={wide} large={large} small={small} width={width} onClick={ev => onClick ? onClick(ev) : null}>
            {icon ?
                <ButtonContent color={theme.darkLightFg}>{icon}&nbsp;{children}</ButtonContent> :
                <ButtonContent color={theme.darkLightFg}>{children}</ButtonContent>
            }
        </BaseButton>
    }

    if (positive) {
        component = <PositiveButton wide={wide} large={large} small={small} width={width} onClick={ev => onClick ? onClick(ev) : null}>
            {icon ?
                <ButtonContent color={theme.white}>{icon}&nbsp;{children}</ButtonContent> :
                <ButtonContent color={theme.white}>{children}</ButtonContent>
            }
        </PositiveButton>
    }
    else if (negative) {
        component = <NegativeButton wide={wide} large={large} small={small} width={width} onClick={ev => onClick ? onClick(ev) : null}>
            {icon ?
                <ButtonContent color={theme.white}>{icon}&nbsp;{children}</ButtonContent> :
                <ButtonContent color={theme.white}>{children}</ButtonContent>
            }
        </NegativeButton>
    }
    else {
        component = <DefaultButton wide={wide} border={border} large={large} small={small} width={width} onClick={ev => onClick ? onClick(ev) : null}>
            {icon ?
                <ButtonContent color={color}>{icon}&nbsp;{children}</ButtonContent> :
                <ButtonContent color={color}>{children}</ButtonContent>
            }
        </DefaultButton>
    }

    if (href) {
        return <Link href={href}>
            <MyAnchor>{component}</MyAnchor>
        </Link>
    }
    return component
}

const BaseButton = styled.div<{ wide?: boolean, large?: boolean, small?: boolean, width?: number, border?: boolean }>`
${props => props.wide ? "" : "display: inline-block;"}
${props => props.width != undefined ? "width: " + props.width + "px;" : ""}
${props => props.large ? "padding: 13px 25px;" :
        props.small ? "padding: 8px 15px;" :
            "padding: 11px 20px;"}

${props => props.large ? "font-size: 130%;" :
        props.small ? "font-size: 85%;" : ""}

cursor: no-drop;

background: ${props => props.theme.lightBg};
box-shadow: 0px 6px 6px rgba(180, 193, 228, 0.35);
border-radius: 8px;
user-select: none;
margin-bottom: 10px;
box-sizing: border-box;
`

const DefaultButton = styled(BaseButton)`
cursor: pointer;
${({ border, theme }) => border ? "border: 2px solid " + theme.lightBorder + ";" : ""}
background: ${props => props.theme.white};

// Compensate 2px border (if applicable)
${({ large, small, border }) =>
        large ? (border ? "padding: 11px 23px;" : "padding: 13px 25px;") :
            small ? (border ? "padding: 6px 13px;" : "padding: 8px 15px;") :
                (border ? "padding: 9px 18px;" : "padding: 11px 20px;")}

&:hover {
    background-color: ${props => props.theme.lightBg};
}
&:active {
    background-color: ${props => props.theme.lightBg2};
}
`

const PositiveButton = styled(BaseButton)`
cursor: pointer;

// box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.25);
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

// box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.25);
background: linear-gradient(106.26deg, ${props => hexToRgbA(props.theme.accent2B)} 5.73%, ${props => hexToRgbA(props.theme.accent2)} 93.83%);

&:hover {
    background: linear-gradient(106.26deg, ${props => hexToRgbA(props.theme.accent2B, 0.9)} 5.73%, ${props => hexToRgbA(props.theme.accent2, 0.9)} 93.83%);
}
&:active {
    background: linear-gradient(106.26deg, ${props => hexToRgbA(props.theme.accent2B, 0.8)} 5.73%, ${props => hexToRgbA(props.theme.accent2, 0.8)} 93.83%);
}
`

const ButtonContent = styled.div<{ color?: ButtonProps["color"] }>`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
${props => props.color == "positive" ? "color: " + props.theme.textAccent1 + ";" :
        props.color == "negative" ? "color: " + props.theme.textAccent2 + ";" :
            !!props.color ? "color: " + props.color + ";" :
                ""}
`

const MyAnchor = styled.a`
color: unset;
`

export default Button
