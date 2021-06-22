import styled from 'styled-components'
import { useMessageAlert } from '../../hooks/message-alert'

export const MessageAlert = () => {
  const { message } = useMessageAlert()

  return (
    <AlertContainer visible={!!message?.length}>
      <TextContainer>{message || ''}</TextContainer>
    </AlertContainer>
  )
}

const AlertContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  z-index: 5010;
  top: 20px;
  right: 10px;
  width: calc(min(100%, 400px));
  font-size: 14px;
  // color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.lightBg};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  display: flex;
  align-items: center;
  padding: 24px;
  border-radius: 8px;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  opacity: ${({ visible }) => (visible ? '1' : '0')};

  box-shadow: 0px 6px 6px rgba(180, 193, 228, 0.35);

  transition: opacity 0.1s ease-out;
`

const TextContainer = styled.p`
margin: 0;
max-width: 100%;
`
