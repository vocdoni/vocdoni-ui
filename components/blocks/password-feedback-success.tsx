import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import Check from 'public/icons/common/check.svg'

export const PasswordFeedbackSuccess = () => {
  const { i18n } = useTranslation()

  return (
    <span>
      <FeedbackTextContainer>
        {i18n.t('success.passphrase_match')}
      </FeedbackTextContainer>
      <Check />
    </span>
  )
}

const FeedbackTextContainer = styled.span`
  margin-right: 8px;
`
