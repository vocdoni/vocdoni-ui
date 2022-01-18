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
import { Button } from '@components/elements/button'

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
      <FlexContainer direction={FlexDirection.Column} alignItem={FlexAlignItem.Center}>
        <ImageContainer width="332px" smWidth="165px">
          <img
            src="/images/vote/preregister-success.svg"
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

        <Button positive onClick={onClose}>
          {i18n.t('pub.votes.close_preregister_modal')}
        </Button>
      </FlexContainer>
    </Modal>
  )
}

const TextContainer = styled.div`
  margin: 30px 0;
`
