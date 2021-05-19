import React from 'react'
import styled from 'styled-components'
import copy from 'copy-to-clipboard';

import i18n from '@i18n'
import { colors } from 'theme/colors'

import { Button } from '@components/button'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { SectionText } from '@components/text'
import { useMessageAlert } from '@hooks/message-alert'

interface IDashedLink {
  link: string
}

export const DashedLink = ({ link }: IDashedLink) => {
  const { setAlertMessage } = useMessageAlert()
  const handleCopy = () => {
    copy(link)
    setAlertMessage(i18n.t("copy.the_link_has_been_copied_to_the_clipboard"))
  }

  return (
    <LinkContainer justify={FlexJustifyContent.SpaceBetween}>
      <LinkText>{link}</LinkText>

      <Button color={colors.textAccent1} border onClick={handleCopy}>
        {i18n.t('vote.copy')}
      </Button>
    </LinkContainer>
  )
}

const LinkContainer = styled(FlexContainer)`
  border: dashed 2px ${({ theme }) => theme.lightBorder};
  padding: 8px 16px;
  border-radius: 6px;
`

const LinkText = styled(SectionText)`
  color: ${({ theme }) => theme.textAccent1};
  overflow: hidden;
  margin: 12px 10px 12px 0;
  text-overflow: ellipsis;
`
