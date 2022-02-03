import styled, { keyframes } from "styled-components"
import SVG, { Props as SVGProps } from "react-inlinesvg";
import { theme } from "@theme/global";

export interface IconProps {
  color?: string
  name: AvailableIcons
  size?: number
}
export interface SpecificIconProps {
  color?: string
  size?: number
}
export type AvailableIcons =
  'chevron-right' |
  'pie-chart' |
  'download' |
  'trash' |
  'shutdown' |
  'pencil' |
  'lightning-slash' |
  'chevron-up-down' |
  'eye' |
  'alert-circle' |
  'spinner' |
  'cog' |
  'calendar' |
  'paper-check'

// ============= //
// GENERAL ICONS //
// ============= //

export const Icon = (props: IconProps) => {
  return (
    <StyledIcon
      name={props.name}
      src={getIconSource(props.name)}
      height={getIconSize(props.size)}
      width={getIconSize(props.size)}
      color={props.color}
    />)
}
const StyledIcon = styled(SVG)`
& path {
  transition: 0.3s;
  stroke: ${getStrokeColor};
  fill: ${getFillColor};
}
`

// ============== //
// SPECIFIC ICONS //
// ============== //

export const TrashIcon = (props: SpecificIconProps) => (
  <StyledIcon
    src="/icons/common/trash.svg"
    name="trash"
    height={getIconSize(props.size)}
    width={getIconSize(props.size)}
    color={props.color}
  />
)
export const PaperCheckIcon = (props: SpecificIconProps) => (
  <StyledIcon
    src="/icons/common/paper-check.svg"
    name="paper-check"
    height={getIconSize(props.size)}
    width={getIconSize(props.size)}
    color={props.color}
  />
)
export const CalendarIcon = (props: SpecificIconProps) => (
  <StyledIcon
    src="/icons/common/calendar.svg"
    name="calendar"
    height={getIconSize(props.size)}
    width={getIconSize(props.size)}
    color={props.color}
  />
)
export const CogIcon = (props: SpecificIconProps) => (
  <StyledIcon
    src="/icons/common/cog.svg"
    name="cog"
    height={getIconSize(props.size)}
    width={getIconSize(props.size)}
    color={props.color}
  />
)
export const ChevronRightIcon = (props: SpecificIconProps) => (
  <StyledIcon
    src="/icons/common/chevron-right.svg"
    height={getIconSize(props.size)}
    width={getIconSize(props.size)}
    color={props.color}
  />
)
export const AlertCircleIcon = (props: SpecificIconProps) => (
  <StyledIcon
    src="/icons/common/alert-circle.svg"
    height={getIconSize(props.size)}
    width={getIconSize(props.size)}
    color={props.color}
  />
)
export const ChevronUpDownIcon = (props: SpecificIconProps) => (
  <StyledIcon
    src="/icons/common/chevron-up-down.svg"
    height={getIconSize(props.size)}
    width={getIconSize(props.size)}
    color={props.color}
  />
)
export const EyeIcon = (props: SpecificIconProps) => (
  <StyledIcon
    src="/icons/common/eye.svg"
    height={getIconSize(props.size)}
    width={getIconSize(props.size)}
    color={props.color}
  />
)
export const PieChartIcon = (props: SpecificIconProps) => (
  <StyledIcon
    src="/icons/common/pie-chart.svg"
    height={getIconSize(props.size)}
    width={getIconSize(props.size)}
    color={props.color}
  />
)
export const QuestionCircleIcon = (props: SpecificIconProps) => (
  <StyledIcon
    src="/icons/common/question-circle.svg"
    height={getIconSize(props.size)}
    width={getIconSize(props.size)}
    color={props.color}
  />
)
export const DownloadIcon = (props: SpecificIconProps) => (
  <StyledIcon
    src="/icons/common/download.svg"
    height={getIconSize(props.size)}
    width={getIconSize(props.size)}
    color={props.color}
  />
)

// old

export const LoadingIcon = ({ size }: { size?: string }) => (
  <img
    src="/images/common/spinner.png"
    alt='loading'
    width={size}
    height={size}
  />
)
export const LinkIcon = ({ size }: { size?: string }) => (
  <img
    src="/images/vote/link-icon.svg"
    alt='link'
    width={size}
    height={size}
  />
)
// export const TrashIcon = ({ size }: { size?: string }) => (
//   <img
//     src="/images/vote/trash-icon.svg"
//     alt='trash-icon'
//     width={size}
//     height={size}
//   />
// )
export const LightningSlashIcon = ({ size }: { size?: string }) => (
  <img
    src="/images/vote/disconnect-icon.svg"
    alt='calendar'
    width={size}
    height={size}
  />
)

export const PenOutlinedIcon = ({ size }: { size?: string }) => (
  <img
    src="/images/vote/authenticate-icon.svg"
    alt='pen-outlined'
    width={size}
    height={size}
  />
)
export const LogOutIcon = ({ size }: { size?: string }) => (
  <img
    src="/images/vote/disconnect-modal-icon.svg"
    alt="logout"
    height={size}
    width={size}
  />
)
export const ExternalLinkIcon = ({ size }: { size?: string }) => (
  <img
    src="/images/vote/link.svg"
    alt="link"
    height={size}
    width={size}
  />
)
export const QuestionOutlinedIcon = ({ size }: { size?: string }) => (
  <img
    src="/images/vote/question-outlined.svg"
    alt="link"
    height={size}
    width={size}
  />
)
export const DocumentOutlinedIcon = ({ size }: { size?: string }) => (
  <img
    src="/images/vote/pdf-outlined.svg"
    alt="link"
    height={size}
    width={size}
  />
)

// ======= //
// HELPERS //
// ======= //

function getFillColor(props: SVGProps) {
  const fillIcons = ['alert-circle', 'spinner', 'cog']
  const hasFill = fillIcons.includes(props.name)
  if (hasFill) {
    if (props.color) {
      return props.color
    }
    return theme.accent1
  }
  return ''
}

function getStrokeColor(props: SVGProps) {
  if (props.color) {
    return props.color
  }
  return theme.accent1
}

function getIconSource(name: AvailableIcons) {
  return `/icons/common/${name}.svg`
}

function getIconSize(size: number) {
  if (size) {
    return `${size}px`
  }
  return '24px'
}

// ========== //
// ANIMATIONS //
// ========== //

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`
export const Rotate = styled.div`
  -webkit-animation: ${rotate} 1s infinite linear;
  -o-animation: ${rotate} 1s infinite  linear;
   animation: ${rotate} 1s infinite linear;
  transform-origin: center center;
  transform-box: fill-box;
`
