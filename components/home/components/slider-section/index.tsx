import React, { useState } from 'react'
import i18n from '@i18n'
import styled from 'styled-components'
import { IconRight, IconLeft } from '@aragon/ui'

import { SliderCard } from './slider-card'

interface IQuotes {
  image: string,
  logo: string,
  backgroundImage: string,
  content: string,
  author: string,
  authorPosition: string,
  authorImage: string
}
const quotes: IQuotes[] = [
  {
    image: "/images/home/slider/slider-1.png",
    logo: '/images/home/slider/slider-1-logo.png',
    backgroundImage: 'linear-gradient(130.31deg, #FA9387 -3.13%, #FFC663 99.27%);',
    content:
      i18n.t('home.the_commitment_to_vocdoni_has_been_clear_as_from_omnium_cultural_we_opted')
    ,
    author: "Anna Girald",
    authorPosition: i18n.t('home.executive_manager_at_omnium'),
    authorImage: "/images/home/slider/slider-1-quote.png"
  },
  {
    image: "/images/home/slider/slider-2.png",
    logo: '/images/home/slider/slider-2-logo.png',
    backgroundImage: 'linear-gradient(130.31deg, #07a474 -3.13%, #57f0c1 99.27%);',
    content:
      i18n.t('home.one_of_the_decisive_facts_that_let_use')
    ,
    author: "Ton Barnils",
    authorPosition: i18n.t('home.ceo_center_excursionistes'),
    authorImage: "/images/home/slider/slider-2-quote.png"
  }
];

export const SliderSection = () => {
  const [activeItem, setActiveItem] = useState<number>(0)

  const nextItem = () => {
    setActiveItem((activeItem + 1) % quotes.length)
  }

  const prevItem = () => {
    setActiveItem((activeItem - 1) % quotes.length)
  }


  return (
    <SliderContainer>
      <RightIconContainer onClick={prevItem}>
        <IconLeft size='medium'/>
      </RightIconContainer>

      <SliderWrapper>
        {quotes.map((quote, index) => (
          <CardContainer key={index} active={index === activeItem} index={index}>
            <SliderCard
              image={quote.image}
              logo={quote.logo}
              backgroundImage={quote.backgroundImage}
              quote={i18n.t(quote.content)}
              authorName={quote.author}
              authorPosition={i18n.t(quote.authorPosition)}
              authorImage={quote.authorImage}
            />
          </CardContainer>
        ))}


        {/* <CardContainer>
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
        </CardContainer> */}
      </SliderWrapper>

      <LeftIconContainer onClick={nextItem}>
        <IconRight size='medium'/>
      </LeftIconContainer>
    </SliderContainer>
  )
}

const SliderContainer = styled.div`
  position: relative;
`

const SliderWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  margin: 0 20px;
`

const CardContainer = styled.div<{ active, index }>`
  visibility: ${({ active }) => active ? 'visible' : 'hidden'};
  opacity: ${({ active }) => active ? '1' : '0'};
  transform: ${({ index }) => 'translateX(-' + index + '00%)'};
  transition: opacity 1500ms ease 0s, transform 500ms ease 0s;
  display: inline-block;
  width: 100%;
  height: 100%;
`

const IconContainer = styled.div`
  width: 56px;
  color: #fff;
  line-height: 69px;
  text-align: center;
  height: 56px;
  border-radius: 30px;
  position: absolute;
  top: 50%;
  margin-top: -28px;
  z-index: 1;
  background: linear-gradient(106.26deg, #A3EC93 5.73%, #46C4C2 93.83%);
`

const RightIconContainer = styled(IconContainer)`
  left: -8px;
`

const LeftIconContainer = styled(IconContainer)`
  right: -8px
`