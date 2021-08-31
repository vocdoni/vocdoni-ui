import React from 'react'
import styled from 'styled-components'
import { EditorActions } from './text-editor-menu'

interface IActionButtonsProps {
  onClick: (action: EditorActions, optionalArgs?: any[]) => void;
  action: EditorActions;
  active?: boolean;
  optionalArgs?: any[],
  children: React.ReactNode;
}



export const ActionButton = ({ children, action, active, optionalArgs, onClick }: IActionButtonsProps) => {
  return (
    <ActionButtonWrapper onClick={() => onClick(action, optionalArgs)} active={active}>
      {children}
    </ActionButtonWrapper>
  )
}


const ActionButtonWrapper = styled.button<{ active?: boolean }>`
  border: 0;
  background: ${({ theme, active }) => (active ? theme.lightBg2 : 'transparent')};
  padding: 4px;
  width: 25px;
  height: 25px;
  border-radius: 4px;
  opacity: 0.6;

  &:hover {
    background: ${({ theme }) => theme.lightBg2};
  }
`