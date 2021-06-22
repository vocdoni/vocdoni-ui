import React, { useEffect } from 'react';
import { useHelpCenter } from '@hooks/help-center';

export const VoteHeader = () => {
  const { hide } = useHelpCenter()

  useEffect(() => {
    hide()
  }, [])

  return  <></>
}