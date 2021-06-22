import React from 'react'
import i18n from '@i18n'
import styled from 'styled-components'

import { useEntityCreation } from '@hooks/entity-creation'

import { Column } from '@components/elements/grid'
import { MainDescription } from '@components/elements/text'
import { H1 } from '@components/elements/typography'

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

const TitleContainer = styled(H1)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`