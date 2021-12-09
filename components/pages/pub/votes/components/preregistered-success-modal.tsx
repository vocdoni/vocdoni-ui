import React from 'react'
import Modal from 'react-rainbow-components/components/Modal'
import styled from 'styled-components'

import {
  FlexAlignItem,
  FlexContainer,
  FlexDirection,
} from '@components/elements/flex'
import { ImageContainer } from '@components/elements/images'
import { TextAlign, Typography, TypographyVariant } from '@components/elements/typography'
import { useTranslation } from 'react-i18next'

interface IPreregisteredSuccessModalProps {
  isOpen: boolean
  processStartDate: string
  onClose: () => void
}

export const PreregisteredSuccessModal = ({
  isOpen,
  processStartDate,
  onClose,
}: IPreregisteredSuccessModalProps) => {
  const { i18n } = useTranslation()

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} hideCloseButton={true}>
      <FlexContainer direction={FlexDirection.Column}>
        <ImageContainer width="332px" smWidth="165px">
          <img
            src="/images/preregistered-success.svg"
            alt="Preregistered Success"
          />
        </ImageContainer>

        <TextContainer>
          <Typography variant={TypographyVariant.H1} align={TextAlign.Center}>
            {i18n.t('pub.votes.preregister_completed')}
          </Typography>
          <Typography variant={TypographyVariant.Small} align={TextAlign.Center}>
            {i18n.t(
              'pub.votes.your_password_was_set_successfully_to_allow_you_participate_on',
              { startDate: processStartDate }
            )}
          </Typography>
        </TextContainer>
      </FlexContainer>
    </Modal>
  )
}

const TextContainer = styled.div`
  margin: 30px 0;
`
