import React from 'react'
import i18n from '@i18n'
import styled from 'styled-components'

import { useEntityCreation } from '@hooks/entity-creation'

import { Column } from '@components/grid'
import { MainDescription, MainTitle } from '@components/text'

export const EntityCreationHeader = () => {
  const { name } = useEntityCreation()

  return (
    <Column sm={12} md={5}>
      <TitleContainer>{name || i18n.t('entity.new_entity')}</TitleContainer>
      <MainDescription>
        {i18n.t('entity.define_your_credentials_to_protect_the_account')}
      </MainDescription>
    </Column>
  )
}

const TitleContainer = styled(MainTitle)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`