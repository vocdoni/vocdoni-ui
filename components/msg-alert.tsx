import styled from 'styled-components'
import { useMessageAlert } from '../hooks/message-alert'

export const MessageAlert = () => {
  const { message } = useMessageAlert()

  return (
    <AlertContainer visible={!!message?.length}>
      <div>{message || ''}</div>
    </AlertContainer>
  )
}

const AlertContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  z-index: 320;
  top: 20px;
  right: 10px;
  max-width: 280px;
  color: ${({theme}) => theme.white};
  background-color: rgba(179, 21, 21, 0.8);

  padding: 8px 12px;
  border-radius: 8px;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  opacity: ${({ visible }) => (visible ? '1' : '0')};

  transition: opacity 0.1s ease-out;
`
