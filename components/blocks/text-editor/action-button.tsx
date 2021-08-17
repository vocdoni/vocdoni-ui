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
  width: 30px;
  height: 30px;
  border-radius: 4px;

  &:hover {
    background: ${({ theme }) => theme.lightBg2};
  }
`