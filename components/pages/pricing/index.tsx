import React, { useState } from 'react';

import { Product } from '@models/Product';
import { Typography, TypographyVariant } from "@components/elements/typography"
import { Column, Grid } from "@components/elements/grid"

import { CheckingCard } from "./checking-card"
import { BoxPlan } from "./box-plan"

interface IPricingProps {
  products: Product[]
}

export const PricingView = ({products}: IPricingProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
  }

  return (
    <div>
      <Typography variant={TypographyVariant.H1}>{"pricing.title"}</Typography>

      <Grid>
        {products.map(product => (
          <Column md={4} sm={12} key={product.name}>
            <BoxPlan product={product} onSelectProduct={handleSelectProduct} />
          </Column>
        ))}
      </Grid>

      <Grid>
        <Column md={6} sm={12}>
          {selectedProduct && <CheckingCard product={selectedProduct} />}
        </Column>
      </Grid>
    </div>
  )
}