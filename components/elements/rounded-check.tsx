import React from 'react'

import styled, { DefaultTheme } from 'styled-components'

export enum RoundedCheckSize {
  ExtraSmall = 'extra-small',
  Small = 'small',
  Regular = 'regular',
  Big = 'Big',
}

interface IRoundedCheckProps {
  checked?: boolean
  size?: RoundedCheckSize
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const RoundedCheck = ({ checked, onClick, size }: IRoundedCheckProps) => {
  return checked ? (
    <Check onClick={onClick} size={size}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          d="M1.73 12.91l6.37 6.37L22.79 4.59"
        />
      </svg>
    </Check>
  ) : (
      <EmptyCheck onClick={onClick} />
  )
}

const RoundedCheckVariantStyle = {
  [RoundedCheckSize.ExtraSmall]: (theme: DefaultTheme) => `
    width: 16px;
    height: 16px;

    & > svg {
      width: 12px;
      margin: 2px;
    }
  `, 
  [RoundedCheckSize.Small]: (theme: DefaultTheme) => `
  width: 18px;
  height: 18px;

  & > svg {
    width: 14px;
    margin: 3px;
  }
  `,
  [RoundedCheckSize.Regular]: (theme: DefaultTheme) => `
    width: 22px;
    height: 22px;

    & > svg {
      width: 16px;
      margin: 3px;
    }
  `,
  [RoundedCheckSize.Big]: (theme: DefaultTheme) => `
    width: 26px;
    height: 26px;

    & > svg {
      width: 18px;
      margin: 5px;
    }
  `,
}

const BaseSpinner = styled.div<{ size?: RoundedCheckSize }>`
  border-radius: 50%;
  flex-shrink: 0;
  ${({ size, theme }) => RoundedCheckVariantStyle[size || RoundedCheckSize.Regular](theme)}
`

const Check = styled(BaseSpinner)`
  background-color: ${({ theme }) => theme.accent1};
  color: ${({ theme }) => theme.white};
  border: 2px solid ${({ theme }) => theme.accent1};
`

const EmptyCheck = styled(BaseSpinner)`
  border: solid 2px ${({ theme }) => theme.lightBorder};
`
