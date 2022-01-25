import React from 'react'
import styled from 'styled-components'
import { Card } from '@components/elements/cards'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/elements/flex'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { Trans, useTranslation } from 'react-i18next'
import { Ul, Li } from '@components/elements/list'

interface IAnonymousCardProps {
  onChange: (value: boolean) => void
  anonymous: boolean
}

export const AnonymousCard = ({ anonymous, onChange }: IAnonymousCardProps) => {
  const { i18n } = useTranslation()

  return (
    <Card>
      <FlexContainer
        alignItem={FlexAlignItem.Center}
        justify={FlexJustifyContent.SpaceBetween}
      >
        <div>
          <Typography variant={TypographyVariant.Body2}>
            {i18n.t('votes.new.anonymous_voting')}
          </Typography>
          <Typography variant={TypographyVariant.Small}>
            {i18n.t(
              'votes.new.would_you_like_this_voting_process_to_ensure_cryptographic_anonymity'
            )}
          </Typography>
        </div>
        <div>
          <BtnGroup>
            <Btn
              onClick={() => {
                onChange(false)
              }}
              active={!anonymous}
            >
              {i18n.t('votes.new.no')}
            </Btn>
            <BtnPositive
              onClick={() => {
                onChange(true)
              }}
              active={anonymous}
            >
              {i18n.t('votes.new.yes')}
            </BtnPositive>
          </BtnGroup>
        </div>
      </FlexContainer>

      {anonymous && (
        <DescriptionContainer>
          <Typography variant={TypographyVariant.ExtraSmall}>
            <strong>
              {i18n.t('votes.new.by_activating_the_anonymous_voting_option')}
            </strong>
          </Typography>

          <Ul>
            <Li>
              {i18n.t(
                'votes.new.it_will_be_impossible_for_a_third_party_to_see_witch_vote_a_use_has_cast'
              )}
            </Li>
            <Li>
              <Trans
                defaults={i18n.t(
                  'votes.new.the_voters_will_need_preregister_before_starting_date'
                )}
                components={[<strong />]}
              />
            </Li>

            <Li>
              {i18n.t(
                'votes.new.the_voters_will_be_required_to_then_authenticate'
              )}
            </Li>
          </Ul>
        </DescriptionContainer>
      )}
    </Card>
  )
}

const DescriptionContainer = styled.div`
  background-color: ${({ theme }) => theme.lightBg};
  padding: 10px 20px;
  border-radius: 16px;
`

const BtnGroup = styled.div`
  height: 48px;
  background-color: rgba(207, 218, 246, 0.15);
  border-radius: 16px;
`

const Btn = styled.button<{ active?: boolean }>`
  width: 140px;
  height: 48px;
  background-color: ${({ theme, active }) =>
    active ? theme.white : 'transparent'};
  text-align: center;
  border-radius: 16px;
  border: ${({ active, theme }) =>
    active ? '2px solid ' + theme.lightText : 'none'};
  color: ${({ active, theme }) => (active ? theme.lightText : theme.blueText)};
`

const BtnPositive = styled(Btn)`
  border: ${({ active, theme }) =>
    active ? '2px solid ' + theme.accent1 : 'none'};
  color: ${({ active, theme }) => (active ? theme.accent1 : theme.blueText)};
`
