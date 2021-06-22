import React, { ReactNode } from 'react'
import styled from 'styled-components'

type RadioProps = {
  children: ReactNode
  onClick?: () => void,
  /** The name used to group radio controls */
  name: string,
  checked?: boolean
}

export const Radio = ({ children, onClick, name, checked}: RadioProps) => (
  <RadioLabel onClick={() => onClick && onClick()}>
    {" "}
    <input
      type="radio"
      readOnly
      checked={checked}
      name={name}
    />
    <div className="checkmark"></div> {children}
  </RadioLabel>
)

const RadioLabel = styled.label`
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 5px 0;
  font-weight: 500;
  color: ${({ theme }) => theme.text};

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
    height: 16px;
    width: 16px;
    background-color: ${({ theme }) => theme.white};
    border-radius: 50%;
    margin-right: 1em;
    border: 1px solid ${({ theme }) => theme.accent1};
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
    background: ${({ theme }) => theme.accent1};
    z-index: 9;
    height: 10px;
    width: 10px;
    margin: 3px;
  }
`
