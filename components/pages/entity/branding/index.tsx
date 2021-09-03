import React, { useState, useEffect } from 'react';
import { EntityMetadata } from 'dvote-js';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ColorPicker } from 'react-rainbow-components';

import { CardDiv } from '@components/elements/cards';
import { CardTextHeader } from '@components/blocks/card/text-header';
import { CardBody } from '@components/blocks/card';
import { Typography, TypographyVariant } from '@components/elements/typography';
import { Column, Grid } from '@components/elements/grid';
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex';
import { Button, JustifyContent } from '@components/elements/button';
import { ColorPickerValue } from 'react-rainbow-components/components/ColorPicker';
import { colors } from '@theme/colors';
import { ImageLoader } from '@components/blocks/image-loader';
import { FALLBACK_ACCOUNT_ICON } from '@const/account';
import { PlazaMetadataKeys } from '@const/metadata-keys';

interface IBrandingData {
  color: string;
  logo: File;
}

interface IEntityBrandingViewProps {
  metadata: EntityMetadata,
  onSave: (branding: IBrandingData) => void,
}

export const EntityBrandingView = ({metadata, onSave}: IEntityBrandingViewProps) => {
  const { i18n } = useTranslation();
  const [storingData, setStoringData] = useState<boolean>(false)
  const [logoFile, setLogoFile] = useState<File>(null)
  const [dataUpdated, setDataUpdated] = useState<boolean>(false)
  const [primaryColor, setPrimaryColor] = useState<ColorPickerValue>({
    hex: metadata && metadata.meta? metadata?.meta[PlazaMetadataKeys.BRAND_COLOR]: '0xfff'
  })

  useEffect(() => {
    if (metadata && metadata.meta && metadata.meta[PlazaMetadataKeys.BRAND_COLOR]) {
      setPrimaryColor({
        hex: metadata?.meta[PlazaMetadataKeys.BRAND_COLOR]
      })
    }
  }, [metadata])

  const handleChangeColor = (color: ColorPickerValue) => {
    setDataUpdated(true)
    setPrimaryColor(color);
  }

  const handleChangeLogo = (file: File) => {
    setLogoFile(file);
    setDataUpdated(true)
  }

  const handleSave = async () => {
    setStoringData(true);

    const branding = {
      color: primaryColor.hex,
      logo: logoFile
    }

    try {
      await onSave(branding);
    } finally {
      setStoringData(false);
    }
  }
  return (
    <CardDiv>
      <CardTextHeader 
        title={i18n.t('entity.branding.customize_your_branding')}
      />
    
      <CardBody>
        <Typography>{i18n.t('entity.branding.you_can_customize_your_branding')}</Typography>

        <Grid>
          <Column md={6} sm={12}>
            <Typography>{i18n.t('entity.branding.customize_your_primary_color')}</Typography>

            <Typography 
              variant={TypographyVariant.Small} 
              color={colors.lightText}
            >{i18n.t('entity.branding.you_can_customize_the_voting_process_colors')}</Typography>

            <ColorPickerContainer>
              <ColorPicker 
                variant='default' 
                value={primaryColor} 
                onChange={handleChangeColor} 
                defaultColors={[]} 
              />
            </ColorPickerContainer>
          </Column>

          <Column md={6} sm={12}>
            <Typography>{i18n.t('entity.branding.customize_your_logo')}</Typography>
            <Typography
              variant={TypographyVariant.Small} 
              color={colors.lightText}
            >{i18n.t('entity.branding.you_can_update_the_visible_logo_on_the_voting_process')}</Typography>

            <ImageLoader 
              onChange={handleChangeLogo} 
              src={metadata?.media?.logo || FALLBACK_ACCOUNT_ICON} 
              imageSize={{width: '50px'}}
            />
          </Column>
        </Grid>

        <FlexContainer justify={FlexJustifyContent.End}>
          <Button 
            positive 
            spinner={storingData} 
            onClick={handleSave}
            disabled={!dataUpdated}
          >{i18n.t('entity.branding.save_changes')}</Button>
        </FlexContainer>
      </CardBody>
    </CardDiv>
  )
}

const ColorPickerContainer = styled.div`
  &  .sc-hORach {
    border: 0px;
  }
`