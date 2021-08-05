import React from "react";
import Modal from "react-rainbow-components/components/Modal";

import { Column, Grid } from "@components/elements/grid";
import { Typography, TypographyVariant } from "@components/elements/typography";
import { Button } from '@components/elements/button'
import i18n from "@i18n";

interface IConfirmModalProps {
  body: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({ body, isOpen, onConfirm, onCancel, confirmButtonText, cancelButtonText }: IConfirmModalProps) => {
  return (
    <Modal onRequestClose={onCancel} isOpen={isOpen}>
      <Grid>
        <Column>
          <Typography variant={TypographyVariant.Body2}>{body}</Typography>
        </Column>
      </Grid>

      <Grid>
        <Column sm={6}>
          <Button
            negative
            onClick={onCancel}
            wide
          >{cancelButtonText || i18n.t('block.confirm_modal.cancel')}</Button>
        </Column>

        <Column sm={6}>
          <Button
            positive
            onClick={onConfirm}
            wide
          >{confirmButtonText || i18n.t('block.confirm_modal.accept')}</Button>
        </Column>
      </Grid>
    </Modal>
  )
}