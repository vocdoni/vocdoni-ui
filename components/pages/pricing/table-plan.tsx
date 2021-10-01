import React from 'react'
import styled from 'styled-components'
import RightArrow from 'remixicon/icons/System/arrow-right-line.svg'
import Subtract from 'remixicon/icons/System/indeterminate-circle-line.svg'

import i18n from '@i18n'

import { Product } from '@models/Product'
import { Subscription } from '@models/Subscription'

import { TextAlign, Typography, TypographyVariant } from '@components/elements/typography'
import { Button, JustifyContent } from '@components/elements/button'
import { Container } from '@components/elements/container'

import { UNLIMITED } from '@const/products'

interface ITablePlanProps {
  products: Product[]
  subscription?: Subscription
  summarize: boolean
  selectedProduct: Product
  onHideFeatures: () => void
  onSelectProduct: (product: Product) => void
  onContactSales: () => void
}

export const TablePlan = ({
  products,
  summarize,
  selectedProduct,
  onSelectProduct,
  onHideFeatures,
  onContactSales,
}: ITablePlanProps) => {
  return (
    <>
      <ProductsTable cellPadding={5} cellSpacing={0}>
        <TableHeader>
          <tr>
            <th>
              <Typography variant={TypographyVariant.Body1}>{i18n.t('pricing.table_plan.plan')}</Typography>
            </th>
            {products.map((product) => (
              <HeaderCel key={product.id} active={product.name === selectedProduct?.name}>
                <Typography variant={TypographyVariant.Body1} align={TextAlign.Center}>
                  {product.title}
                </Typography>
              </HeaderCel>
            ))}

            <CustomHeaderPlanCell>
              <Typography variant={TypographyVariant.Body1} align={TextAlign.Center}>
                {i18n.t('pricing.table_plan.custom')}
              </Typography>
            </CustomHeaderPlanCell>
          </tr>
        </TableHeader>

        <tbody>
          <tr>
            <FeatureCell>
              <Typography variant={TypographyVariant.Small}>{i18n.t('pricing.table_plan.base_price')}</Typography>
            </FeatureCell>

            {products.map((product) => (
              <FeatureCelValue
                key={product.id}
                active={product.name === selectedProduct?.name}
                data-label={`${product.title} ${i18n.t('pricing.table_plan.base_price')}`}>
                <Typography variant={TypographyVariant.Body3} align={TextAlign.Center}>
                  € {!product.freePlan ? product.priceEuro : '0.00'}
                </Typography>
              </FeatureCelValue>
            ))}

            <FeatureCelValue rowSpan={2}>
              <Typography variant={TypographyVariant.Small} align={TextAlign.Center}>
                {i18n.t('pricing.table_plan.do_you_have_more_than_100000_members')}
              </Typography>
            </FeatureCelValue>
          </tr>

          <tr>
            <FeatureCell>
              <Typography variant={TypographyVariant.Small}>
                {i18n.t('pricing.table_plan.added_cost_per_voter')}
              </Typography>
            </FeatureCell>

            {products.map((product) => (
              <FeatureCelValue
                key={product.id}
                active={product.name === selectedProduct?.name}
                data-label={i18n.t('pricing.table_plan.added_cost_per_voter')}>
                <Typography variant={TypographyVariant.Body2} align={TextAlign.Center}>
                  {!product.freePlan ? `€ ${product.pricePerVoterEuro}` : '-'}
                </Typography>
              </FeatureCelValue>
            ))}
          </tr>

          <tr>
            <FeatureCell></FeatureCell>
            {products.map((product) => (
              <FeatureCelValue
                key={product.id}
                active={product.name === selectedProduct?.name}
                data-label={i18n.t('pricing.table_plan.base_price')}>
                <PlanButtonContainer>
                  {product.freePlan ? (
                    <Button positive small wide disabled>
                      {i18n.t('pricing.table_plan.current_plan')}
                    </Button>
                  ) : (
                    <Button positive small wide onClick={() => onSelectProduct(product)}>
                      {i18n.t('pricing.table_plan.try_for_free')}
                    </Button>
                  )}
                </PlanButtonContainer>
              </FeatureCelValue>
            ))}

            <CustomPlanCell rowSpan={2}>
              <Typography variant={TypographyVariant.Small} align={TextAlign.Center}>
                {i18n.t('pricing.table_plan.get_in_touch_with_our_team_to_discus')}
              </Typography>
            </CustomPlanCell>
          </tr>

          <tr>
            <FeatureCell>
              <Typography variant={TypographyVariant.Small}>
                {i18n.t('pricing.table_plan.voting_process_per_year')}
              </Typography>
            </FeatureCell>

            {products.map((product) => (
              <FeatureCelValue
                key={product.id}
                active={product.name === selectedProduct?.name}
                data-label={i18n.t('pricing.table_plan.voting_process_per_year')}>
                <Typography variant={TypographyVariant.Body2} align={TextAlign.Center}>
                  {product.features.votingPerYear === UNLIMITED
                    ? i18n.t('pricing.table_plan.unlimited')
                    : product.features.votingPerYear}
                </Typography>
              </FeatureCelValue>
            ))}
          </tr>

          <tr>
            <FeatureCell>
              <Typography variant={TypographyVariant.Small}>{i18n.t('pricing.table_plan.administrators')}</Typography>
            </FeatureCell>
            {products.map((product) => (
              <FeatureCelValue
                key={product.id}
                active={product.name === selectedProduct?.name}
                data-label={i18n.t('pricing.table_plan.administrators')}>
                <Typography variant={TypographyVariant.Body2} align={TextAlign.Center}>
                  {product.features.administrators}
                </Typography>
              </FeatureCelValue>
            ))}
            <CustomPlanCell rowSpan={2}>
              <Button wide onClick={onContactSales}>
                {i18n.t('pricing.table_plan.contact_us')}
                <RightArrow width="20px" />
              </Button>
            </CustomPlanCell>
          </tr>

          <tr>
            <FeatureCell>
              <Typography variant={TypographyVariant.Small}>{i18n.t('pricing.table_plan.features')}</Typography>
            </FeatureCell>

            {products.map((product) => (
              <FeatureCelValue
                key={product.id}
                active={product.name === selectedProduct?.name}
                data-label={i18n.t('pricing.table_plan.features')}>
                <Typography variant={TypographyVariant.Body2} align={TextAlign.Center}>
                  {i18n.t('pricing.table_plan.number_of_features', {
                    number_of_features: product.features?.list?.length,
                  })}
                </Typography>
              </FeatureCelValue>
            ))}
          </tr>
        </tbody>
      </ProductsTable>

      <SummarizeProductsTableWrapper visible={summarize}>
        <Container>
          <SummarizeProductsTable>
            <thead>
              <tr>
                <th>
                  <Typography variant={TypographyVariant.Body1}>{i18n.t('pricing.table_plan.features')}</Typography>
                </th>

                {products.map((product) => (
                  <HeaderCel key={product.id}>
                    <Typography variant={TypographyVariant.Body1} align={TextAlign.Center}>
                      {product.title}
                    </Typography>
                  </HeaderCel>
                ))}
                <CustomHeaderPlanCell>
                  <Typography variant={TypographyVariant.Body1} align={TextAlign.Center}>
                    {i18n.t('pricing.table_plan.custom')}
                  </Typography>
                </CustomHeaderPlanCell>
              </tr>
            </thead>

            <tbody>
              <tr>
                <FeatureCell></FeatureCell>

                {products.map((product) => (
                  <FeatureCelValue
                    key={product.id}
                    data-label={`${product.title} ${i18n.t('pricing.table_plan.base_price')}`}>
                    <Typography variant={TypographyVariant.Body3} align={TextAlign.Center}>
                      € {!product.freePlan ? product.priceEuro : '0.00'}
                    </Typography>
                  </FeatureCelValue>
                ))}

                <FeatureCelValue>
                  <Typography variant={TypographyVariant.Small} align={TextAlign.Center}>
                    {i18n.t('pricing.table_plan.custom_plan_for_over_100000_members')}
                  </Typography>
                </FeatureCelValue>
              </tr>

              <tr>
                <FeatureCell rowSpan={2}>
                  <Button wide small onClick={onHideFeatures} justify={JustifyContent.SpaceEvenly}>
                    <Subtract width="20px" />
                    {i18n.t('pricing.table_plan.hide_all_features')}
                  </Button>
                </FeatureCell>

                {products.map((product) => (
                  <FeatureCelValue key={product.id} data-label={i18n.t('pricing.table_plan.base_price')}>
                    <PlanButtonContainer>
                      {product.freePlan ? (
                        <Button positive small wide disabled>
                          {i18n.t('pricing.table_plan.current_plan')}
                        </Button>
                      ) : (
                        <Button positive small wide onClick={() => onSelectProduct(product)}>
                          {i18n.t('pricing.table_plan.try_for_free')}
                        </Button>
                      )}
                    </PlanButtonContainer>
                  </FeatureCelValue>
                ))}
                <PlanButtonContainer>
                  <Button wide small onClick={onContactSales} justify={JustifyContent.SpaceEvenly}>
                    {i18n.t('pricing.table_plan.contact_us')}
                    <RightArrow width="20px" />
                  </Button>
                </PlanButtonContainer>
              </tr>
            </tbody>
          </SummarizeProductsTable>
        </Container>
      </SummarizeProductsTableWrapper>
    </>
  )
}

const SummarizeProductsTableWrapper = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  padding-top: 80px;
  background-color: ${({ theme }) => theme.background};
  transition: margin 0.4s ease-in-out;
  margin-top: ${({ visible }) => (visible ? '0' : '-100%')};
`

const SummarizeProductsTable = styled.table`
  width: 100%;
  table-layout: fixed;
`

const ProductsTable = styled.table`
  width: 100%;
  table-layout: fixed;

  tr:last-child td {
    border-radius: 0 0 8px 8px;
  }
`

const TableHeader = styled.thead`
  @media ${({ theme }) => theme.screenMax.mobileM} {
    display: none;
  }
`

const HeaderCel = styled.th<{ active?: boolean }>`
  background-color: ${({ active, theme }) => (active ? theme.darkLightFg : 'transparent')};
  border-radius: 8px 8px 0 0;
  text-align: center;

  & > p {
    color: ${({ active, theme }) => (active ? theme.white : theme.blueText)} !important;
  }
`

const FeatureCelValue = styled.td<{ active?: boolean }>`
  text-align: center;
  background-color: ${({ active, theme }) => (active ? theme.darkLightFg : 'transparent')};

  & > p {
    color: ${({ active, theme }) => (active ? theme.white : theme.blueText)} !important;
  }
  @media ${({ theme }) => theme.screenMax.mobileM} {
    display: block;

    &::before {
      content: attr(data-label);
      display: block;
      font-weight: bold;
    }
  }
`

const CustomHeaderPlanCell = styled(HeaderCel)`
  width: 180px;
`

const CustomPlanCell = styled(FeatureCelValue)`
  width: 180px;
`

const FeatureCell = styled.td`
  @media ${({ theme }) => theme.screenMax.mobileM} {
    display: none;
  }
`

const PlanButtonContainer = styled.div`
  padding: 10px;
`
