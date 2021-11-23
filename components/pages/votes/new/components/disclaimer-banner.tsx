import React from 'react'

import { Trans, useTranslation } from 'react-i18next'

import { colors } from '@theme/colors'

import { Banner, BannerVariant } from '@components/blocks/banner_v2'
import { FlexAlignItem, FlexContainer } from '@components/elements/flex'
import { Radio } from '@components/elements/radio'
import { Typography, TypographyVariant } from '@components/elements/typography'

interface IDisclaimerBannerProps {
  onClickTerms: () => void
  onOpenTerms: () => void
  termsAccepted: boolean
}

export const DisclaimerBanner = ({
  onClickTerms,
  onOpenTerms,
  termsAccepted,
}: IDisclaimerBannerProps) => {
  const { i18n } = useTranslation()

  return (
    <Banner
      icon={<img src="/images/vote/disclaimer.svg" />}
      variant={BannerVariant.Secondary}
    >
      <Typography
        variant={TypographyVariant.H4}
        color={colors.warningText}
        margin="0 0 10px 0"
      >
        {i18n.t('votes.new.disclaimer')}
      </Typography>
      <Typography
        variant={TypographyVariant.MediumSmall}
        margin="0 0 10px 0"
        color={colors.lightText}
      >
        {i18n.t(
          'votes.new.vocdoni_currently_only_support_public_voting_process'
        )}  
      </Typography>

      <FlexContainer alignItem={FlexAlignItem.Center}>
        <Radio
          name="terms-and-conditions"
          checked={termsAccepted}
          onClick={onClickTerms}
          value="terms-and-conditions"
        >
          <Typography
            variant={TypographyVariant.MediumSmall}
            color={colors.lightText}
            margin="0"
          >
            {' '}
            <Trans
              defaults={i18n.t(
                'votes.new.i_understand_and_i_agree_to_the_terms_and_conditions'
              )}
              components={[<a onClick={onOpenTerms} />]}
            ></Trans>
          </Typography>
        </Radio>
      </FlexContainer>
    </Banner>
  )
}
