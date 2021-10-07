import React, { useState, useRef, SyntheticEvent, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { FlexContainer, FlexAlignItem } from '@components/elements/flex';
import { ImageContainer } from '@components/elements/images';
import { Image } from '@components/elements/image';
import { Button } from '@components/elements/button';

interface IImageSize {
  width?: string;
  height?: string;
}

interface IImageLoaderProps {
  buttonText?: string;
  src: string;
  imageSize?: IImageSize;
  onChange: (event: File) => void;
}

export const ImageLoader = ({ buttonText, src, imageSize, onChange }: IImageLoaderProps) => {
  const { i18n } = useTranslation()
  const [imageBase64, setImageBase64] = useState<string>()
  const imageWidth = imageSize && imageSize.width? imageSize.width : '100%'
  const imageHeight = imageSize && imageSize.height? imageSize.height : 'auto'

  const fileReader = useRef<FileReader>(new FileReader())
  const fileInputRef = useRef<HTMLInputElement>()

  const handleFileUploaded = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files
    
    if (file) {
      fileReader.current.readAsDataURL(file)
      fileReader.current.onload = () => setImageBase64(fileReader.current.result as string)

      onChange(file)
    }
  }

  return (
    <FlexContainer alignItem={FlexAlignItem.Center}>
      <ImageContainer width={imageSize?.width} height={imageSize?.height}>
        {imageBase64 ? <Image src={`${imageBase64}`} /> : <Image src={src} />}
      </ImageContainer>

      <input
        type='file'
        ref={fileInputRef}
        accept=".png, .jpg, .jpeg, .gif"
        onChange={handleFileUploaded}
        style={{ display: 'none' }}
      />

      <UploadButtonContainer>
        <Button
          border={true}
          onClick={() => fileInputRef && fileInputRef.current?.click()}
        >{buttonText || i18n.t('block.image_loader.upload_file')}</Button>
      </UploadButtonContainer>
    </FlexContainer>
  )
}

const UploadButtonContainer = styled.div`
  padding-left: 20px;
`