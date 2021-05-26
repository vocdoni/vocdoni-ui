import React from 'react'

import styled, { DefaultTheme } from 'styled-components'

export enum RoundedCheckSize {
  Small = 'small',
  Regular = 'regular',
  Big = 'Big',
}

interface IRoundedCheckProps {
  checked?: boolean
  size?: RoundedCheckSize
}

export const RoundedCheck = ({ checked }: IRoundedCheckProps) => {
  return checked ? (
    <Check>
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
    <EmptyCheck></EmptyCheck>
  )
}

const RoundedCheckVariantStyle = {
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

const BaseSpinner = styled.div<{ checkSize?: RoundedCheckSize }>`
  border-radius: 50%;
  ${({ checkSize, theme }) => RoundedCheckVariantStyle[checkSize || RoundedCheckSize.Regular](theme)}
`

const Check = styled(BaseSpinner)`
  background-color: ${({ theme }) => theme.accent1};
  color: ${({ theme }) => theme.white};
`

const EmptyCheck = styled(BaseSpinner)`
  border: solid 2px ${({ theme }) => theme.lightBorder};
`
