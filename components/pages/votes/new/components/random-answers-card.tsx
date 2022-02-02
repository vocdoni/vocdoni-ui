import React from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Grid } from '@components/elements/grid'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { colors } from 'theme/colors'
import styled from 'styled-components'
import { Ul, Li } from '@components/elements/list'
import { BtnGroup, BtnGroupContainer } from './btn-group'

interface IRandomAnswersCardProps {
  onClick: (type: VotingType) => void
  randomAnswersOrder: boolean
}

export const RandomAnswersCard = ({ onClick, randomAnswersOrder }: IRandomAnswersCardProps) => {
  const { i18n } = useTranslation()

  return (
    <ContainerBox>
      <Grid>
        <Column sm={12} md={8}>
          <Typography
            variant={TypographyVariant.Small}
            color={colors.blueText}
          >
            <strong>{i18n.t('votes.new.random_order_answers')}</strong>
          </Typography>
          <div>{i18n.t('votes.new.random_order_answers_text')}</div>
        </Column>
        <Column sm={12} md={4}>        
          <BtnGroupContainer size='small'>
            <BtnGroup
              active={randomAnswersOrder === false}
              onClick={() => onClick(false)}              
              size='small'
            >
              <Btn>
                <strong>{i18n.t('votes.new.no')}</strong>
              </Btn>
            </BtnGroup>

            <BtnGroup
              active={randomAnswersOrder === true}
              onClick={() => onClick(true)}
              size='small'
            >
              <Btn>
                <strong>{i18n.t('votes.new.yes')}</strong>
              </Btn>
            </BtnGroup>     
          </BtnGroupContainer>
        </Column>
        
        {randomAnswersOrder && (
        <DescriptionContainer>
          <Typography variant={TypographyVariant.ExtraSmall}>
            <strong>
              {i18n.t('votes.new.activate_random_title')}
            </strong>
          </Typography>

          <Ul>
            <Li>
              {i18n.t('votes.new.activate_random_desc')}
            </Li>
          </Ul>
        </DescriptionContainer>
        )}
      </Grid>
    </ContainerBox>
  )
}

const DescriptionContainer = styled.div`
  background-color: ${({ theme }) => theme.lightBg};
  padding: 10px 20px;
  border-radius: 16px;
  width: 100%;
`

const ContainerBox = styled.div`
  border: 2px solid #DEEFFF;
  border-radius: 16px;
  padding:0px 20px 20px;
  box-sizing: border-box;
`

const Btn = styled.button<{ active?: boolean }>`
  width: 140px;
  height: 48px;
  background-color: ${({ theme, active }) => active ? theme.white : 'transparent'};
  text-align: center;
  border-radius: 16px;
  border: ${({ active, theme }) => active ? '2px solid ' + theme.lightText : 'none'};
  color: ${({ active, theme }) => (active ? theme.lightText : theme.blueText)};
`

const BtnPositive = styled(Btn)`
  border: ${({ active, theme }) => active ? '2px solid ' + theme.accent1 : 'none'};
  color: ${({ active, theme }) => (active ? theme.accent1 : theme.blueText)};
`
