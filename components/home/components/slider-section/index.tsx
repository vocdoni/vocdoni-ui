import React from 'react'
import i18n from '@i18n'

import { SliderCard } from './slider-card'

export const SliderSection = () => {
  return (
    <>
      <SliderCard
        image="/images/home/slider/slider-1.png"
        logo='/images/home/slider/slider-1-logo.png'
        backgroundImage='linear-gradient(130.31deg, #FA9387 -3.13%, #FFC663 99.27%);'
        quote={i18n.t(
          'home.the_commitment_to_vocdoni_has_been_clear_as_from_omnium_cultural_we_opted'
        )}
        authorName="Anna Girald"
        authorPosition={i18n.t('home.executive_manager_at_omnium')}
        authorImage="/images/home/slider/slider-1-quote.png"
      />
    </>
  )
}
