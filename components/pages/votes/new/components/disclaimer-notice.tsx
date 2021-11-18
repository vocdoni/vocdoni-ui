import React from 'react';
import { useTranslation } from 'react-i18next';

interface IDisclaimerNoticeProps {
  onAccept: () => void;
  accepted: boolean;
}

export const DisclaimerNotice = () => {
  const { i18n } = useTranslation();
  return (<></>)
}