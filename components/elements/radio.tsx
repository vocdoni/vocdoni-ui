import React, { ReactNode } from 'react'
import styled from 'styled-components'

type RadioProps = {
  children: ReactNode
  onClick?: () => void
  value?: string
  /** The name used to group radio controls */
  name: string
  checked?: boolean,
  disabled?: boolean,
}

export const Radio = ({
  children,
  onClick,
  name,
  value,
  checked,
  disabled,
}: RadioProps) => (
  <RadioLabel onClick={(event) => {
    event.preventDefault()
    onClick && onClick()
  }}>
    { !disabled && 
      <RadioContainer>
        <input
          type="radio"
          readOnly
          value={value}
          checked={checked}
          name={name}
        />
        <div className="checkmark"></div>
      </RadioContainer>
    }

    { disabled && 
      <RadioContainer>
        <input
          type="radio"
          readOnly
          name={name}
        />
        <div className="checkmark checkmarkDisabled"></div>
      </RadioContainer>
    }
    <ChildrenContainer>{children}</ChildrenContainer>
  </RadioLabel>
)

const RadioContainer = styled.div`
  position: relative;
`

const ChildrenContainer = styled.div`
position: relative;
font-size: 16px;
`

const RadioLabel = styled.label`
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 15px 0;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 5px;

  display: flex;
  flex-direction: row;
  align-items: center;

  /* Hide the browser's default radio button */
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  /* Create a custom radio button */
  .checkmark {
    position: relative;
    height: 24px;
    width: 24px;
    min-width: 24px;
    background-color: ${({ theme }) => theme.white};
    border-radius: 50%;
    margin-right: 1em;
    border: 1px solid #2E377A;
  }

  .checkmarkDisabled {
    position: relative;
    height: 24px;
    width: 24px;
    min-width: 24px;
    background-color: #E4E7EB;
    border-radius: 50%;
    margin-right: 1em;
    border: 1px solid #2E377A;
    cursor: default;
  }

  /* When the radio button is checked, add a blue background */
  input:checked ~ .checkmark {
    background-color: ${({ theme }) => theme.white};
  }

  /* Create the indicator (the dot/circle - hidden when not checked) */
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  /* Show the indicator (dot/circle) when checked */
  input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the indicator (dot/circle) */
  .checkmark:after {
    border-radius: 50%;
    background: linear-gradient(103.11deg, #A50044 0.33%, #174183 99.87%);
    z-index: 9;
    height: 18px;
    width: 18px;
    margin: 3px;
  }
`
