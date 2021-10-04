import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import Question from 'remixicon/icons/System/question-line.svg'
import AddCircle from 'remixicon/icons/System/add-circle-line.svg'
import RightArrow from 'remixicon/icons/System/arrow-right-line.svg'
import { useTranslation } from 'react-i18next'

import { Product } from '@models/Product'

import { TextAlign, Typography, TypographyVariant } from '@components/elements/typography'
import { Column, Grid } from '@components/elements/grid'
import { Steps } from '@components/blocks/steps'
import { Card } from '@components/elements/cards'
import { Button } from '@components/elements/button'
import { FlexAlignItem, FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { colors } from '@theme/colors'

import { useHelpCenter } from '@hooks/help-center'

import { TableFeatures } from './table-features'
import { CheckingCard } from './checking-card'
import { TablePlan } from './table-plan'

interface IPricingProps {
  products: Product[]
}

const HEADER_HEIGHT = 80

export const PricingView = ({ products }: IPricingProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showFeatures, setShowFeatures] = useState<boolean>(false)
  const [summarizePlans, setSummarizePlans] = useState<boolean>(false)
  const [featuresHeight, setFeaturesHeight] = useState<string>('0px')

  const tablePlanRef = useRef<HTMLDivElement>()

  const { i18n } = useTranslation()

  const helpCenter = useHelpCenter()

  const handleScroll = (event) => {
    const tableYOffset = tablePlanRef.current.getBoundingClientRect().y

    if (tableYOffset < -tablePlanRef.current.offsetHeight + HEADER_HEIGHT) {
      setSummarizePlans(true)
    } else {
      setSummarizePlans(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!summarizePlans) {
      setFeaturesHeight(tablePlanRef.current.getBoundingClientRect().height + 'px')
    }
  }, [summarizePlans])

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowFeatures(false)
  }

  const handleContactSales = () => {
    helpCenter.open()
  }

  const handleToggleShowFeatures = () => {
    setShowFeatures(!showFeatures)
  }

  return (
    <div>
      <Grid>
        <Column>
          <Typography variant={TypographyVariant.H3} align={TextAlign.Center}>
            {i18n.t('payment.header.title')}
          </Typography>
          <Typography variant={TypographyVariant.Body1} align={TextAlign.Center}>
            {i18n.t('payment.header.description')}
          </Typography>
        </Column>

        <StepperContainer>
          <Steps
            steps={[
              i18n.t('pricing.steps.select_plan'),
              i18n.t('pricing.steps.checkout'),
              i18n.t('pricing.steps.select_plan'),
            ]}
            activeIdx={0}
            showProgress={true}
          />
        </StepperContainer>
      </Grid>

      {/* <TableProductsShadow height={featuresHeight} /> */}
      <TableProductsContainer ref={tablePlanRef}>
        <TablePlan
          products={products}
          summarize={summarizePlans && showFeatures}
          selectedProduct={selectedProduct}
          onSelectProduct={handleSelectProduct}
          onContactSales={handleContactSales}
          onHideFeatures={handleToggleShowFeatures}
        />
      </TableProductsContainer>

      {selectedProduct && <CheckingCard product={selectedProduct} />}

      <TableFeaturesContainer showTable={showFeatures}>
        <TableFeatures products={products} />
      </TableFeaturesContainer>

      <div>
        <Button wide onClick={handleToggleShowFeatures}>
          <AddCircle width="25px" fill={colors.blueText} />
          <Typography variant={TypographyVariant.Body1} align={TextAlign.Center} margin="0 0 0 10px">
            {i18n.t('pricing.body.show_all_features')}
          </Typography>
        </Button>
      </div>

      <Grid>
        <Card>
          <FlexContainer alignItem={FlexAlignItem.Center} justify={FlexJustifyContent.SpaceBetween}>
            <FlexContainer alignItem={FlexAlignItem.Center}>
              <Question width="20px" fill={colors.blueText} />
              <Typography variant={TypographyVariant.Small} margin="0 0 0 10px">
                {i18n.t('pricing.body.need_help_or_want_to_discuss_a_personalized_plan')}
              </Typography>
            </FlexContainer>

            <div>
              <ButtonContainer>
                <Button positive>{i18n.t('pricing.body.faq')}</Button>
              </ButtonContainer>

              <ButtonContainer>
                <Button>
                  {i18n.t('pricing.body.contact_us')}
                  <RightArrow />
                </Button>
              </ButtonContainer>
            </div>
          </FlexContainer>
        </Card>
      </Grid>
    </div>
  )
}

const TableProductsContainer = styled.div`
  padding-top: 60px;
  padding-bottom: 30px;
`
const TableFeaturesContainer = styled.div<{ showTable: boolean }>`
  overflow: hidden;
  max-height: ${({ showTable }) => (showTable ? '4000px' : '0')};
  transition: max-height 1s ease-in-out;
`

const ButtonContainer = styled.div`
  margin-right: 10px;
  display: inline-block;

  & > button {
    min-width: 150px;
  }
`
const StepperContainer = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 20px auto 0;
`
