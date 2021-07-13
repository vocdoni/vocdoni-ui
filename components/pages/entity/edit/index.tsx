import React, { ChangeEvent, useState, useRef } from 'react'
import { EntityMetadata } from 'dvote-js'
import styled from 'styled-components'
import i18n from '@i18n'

import { IEntityRegistryState } from 'recoil/atoms/entity-registry'

import { Button } from '@components/elements/button'
import { CardDiv } from '@components/elements/cards'
import { CardTextHeader } from '@components/blocks/card/text-header'
import { Grid, Column } from '@components/elements/grid'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { InputFormGroup, SelectFormGroup, TextareaFormGroup, FileLoaderFormGroup } from '@components/blocks/form'
import { ISelectOption } from '@components/elements/inputs'
import { ImageContainer } from '@components/elements/images'
import { Image } from '@components/elements/image'
import { FlexContainer, FlexAlignItem, FlexJustifyContent } from '@components/elements/flex'
import { entityDataValidator } from './data-validator'
import { ErrorFields } from '@lib/validators'
import { EntityNameAlreadyExistError } from '@lib/validators/errors/entity-name-already-exits-error'
import { useMessageAlert } from '@hooks/message-alert'
import { UpdateEntityDataError } from '@lib/validators/errors/update-entity-data-error'
import { StoreMediaError } from '@lib/validators/errors/store-media-error'
import { StoringDataOnBlockchainError } from '@lib/validators/errors/storing-data-on-blockchain-error'

import { SELECT_ORGANIZATION_SIZE, SELECT_ORGANIZATION_TYPE } from '../const/organizations'

export enum UpdatedDataType {
  EntityRegistry = 'registry',
  EntityMetadata = 'meta',
  EntityLogo = 'logo'
}

export interface IEntityData {
  registryData: IEntityRegistryState,
  metadata: EntityMetadata,
  logoFile: File,
  updatedData: UpdatedDataType[]
}

interface IDashboardEntityViewProps {
  entityMetadata: EntityMetadata,
  entityRegistryData: IEntityRegistryState,
  storeData: (data: IEntityData) => Promise<void>
}

export enum EntityFields {
  Name = 'name',
  Email = 'email',
  Type = 'type',
  Size = 'size',
  Description = 'description'
}
export const EntityEditView = ({
  entityMetadata,
  entityRegistryData,
  storeData,
}: IDashboardEntityViewProps) => {
  const [updatedData, setUpdatedData] = useState<UpdatedDataType[]>([]);
  const [name, setName] = useState(entityRegistryData?.name)
  const [email, setEmail] = useState(entityRegistryData?.email)
  const [type, setType] = useState<string>(entityRegistryData?.type)
  const [size, setSize] = useState<number>(entityRegistryData?.size)
  const [description, setDescription] = useState(entityMetadata?.description.default)
  const [imageBase64, setImageBase64] = useState<string>()
  const [entityDataErrors, setEntityDataErrors] = useState<ErrorFields>(new Map())

  const [logoFile, setLogoFile] = useState<File>()
  const [storingData, setStoringData] = useState<boolean>(false)

  const { setAlertMessage } = useMessageAlert()

  const inputFileRef = useRef<HTMLInputElement>()
  const fileReader = useRef<FileReader>(new FileReader())

  const entityType = SELECT_ORGANIZATION_TYPE.find((option: ISelectOption) => option.value === type)
  const entitySize = SELECT_ORGANIZATION_SIZE.find((option: ISelectOption) => option.value === size)

  const dirtyDataType = (dataType: UpdatedDataType) => {
    if (!updatedData.includes(dataType)) {
      setUpdatedData([...updatedData, dataType])
    }
  }

  const storeEntityData = async () => {
    const entityData = {
      registryData: {
        ...entityRegistryData,
        name,
        email,
        size,
        type
      },
      metadata: {
        ...entityMetadata,
        name: {
          default: name
        },
        description: {
          default: description
        }
      },
      logoFile,
      updatedData
    }
    const invalidFields = entityDataValidator(entityData);

    if (invalidFields.size) {
      setEntityDataErrors(invalidFields)
      return
    }

    try {
      setStoringData(true)
      await storeData(entityData)

      setUpdatedData([])
    } catch (error) {
      if(error instanceof EntityNameAlreadyExistError) {
        entityDataErrors.set(EntityFields.Name, error)

        setEntityDataErrors(entityDataErrors)
      } else if (error instanceof UpdateEntityDataError) {
        setAlertMessage(i18n.t('entity.edit.error_updating_data_on_register_server'))
      } else if (error instanceof StoreMediaError) {
        setAlertMessage(error.message)
      } else if (error instanceof StoringDataOnBlockchainError) {
        setAlertMessage(i18n.t('entity.edit.error_updating_data_on_blockchain'))
      }
    } finally {
      setStoringData(false)
    }
  }

  return (
    <CardDiv>
      <CardTextHeader
        title={i18n.t('entity.edit.your_entity')}
        subtitle={i18n.t('entity.edit.the_details_of_your_organization')}
      ></CardTextHeader>

      <CardBody>
        <Grid>
          <Column>
            <Typography variant={TypographyVariant.H3} margin='0'>{i18n.t('entity.edit.entity_details')}</Typography>
          </Column>

          <Column sm={12} md={6}>
            <InputFormGroup
              label={i18n.t('entity.edit.name_of_the_entity')}
              type='text'
              id='entity-name'
              error={entityDataErrors.get(EntityFields.Name)?.message}
              editButton={true}
              value={name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dirtyDataType(UpdatedDataType.EntityRegistry)
                dirtyDataType(UpdatedDataType.EntityMetadata)
                setName(event.target.value )
              }}
            />
          </Column>

          <Column sm={12} md={6}>
            <InputFormGroup
              label={i18n.t('entity.edit.contact_email')}
              type='text'
              error={entityDataErrors.get(EntityFields.Email)?.message}
              id='entity-email'
              editButton={true}
              value={email}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dirtyDataType(UpdatedDataType.EntityRegistry)
                setEmail(event.target.value)
              }}
            />
          </Column>
        </Grid>

        <Grid>
          <Column sm={12} md={6}>
            <SelectFormGroup
              label={i18n.t('entity.edit.type_of_entity')}
              value={entityType}
              id='entity-type'
              options={SELECT_ORGANIZATION_TYPE}
              onChange={(option: ISelectOption) => {
                dirtyDataType(UpdatedDataType.EntityRegistry)
                setType(option.value as string)
              }}
            />
          </Column>

          <Column sm={12} md={6}>
            <SelectFormGroup
              label={i18n.t('entity.edit.size_of_entity')}
              value={entitySize}
              id='entity-size'
              options={SELECT_ORGANIZATION_SIZE}
              onChange={(option: ISelectOption) => {
                dirtyDataType(UpdatedDataType.EntityRegistry)
                setSize(option.value as number)
              }}
            />
          </Column>
        </Grid>

        <Grid>
          <Column sm={12}>
            <TextareaFormGroup
              title={i18n.t('entity.edit.description')}
              label={i18n.t('entity.edit.optional_introduction')}
              value={description}
              error={entityDataErrors.get(EntityFields.Description)?.message}
              id='entity-description'
              editButton={true}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                dirtyDataType(UpdatedDataType.EntityMetadata)
                setDescription(event.target.value)
              }}
            />
          </Column>
        </Grid>

        <Grid>
          <Column>
            <Typography variant={TypographyVariant.H3} margin='0 0 10px'>{i18n.t('entity.edit.entity_logo')}</Typography>
            <Typography variant={TypographyVariant.Small}>{i18n.t('entity.edit.jpg_png_gif')}</Typography>

            <FlexContainer alignItem={FlexAlignItem.Center}>
              <ImageContainer width='50px' height='50px'>
                {imageBase64 ? <Image src={`${imageBase64}`} /> : <Image src={entityMetadata?.media.avatar} />}
                
              </ImageContainer>
              <input
                type='file'
                ref={inputFileRef}
                onChange={(event) => {
                  const [file] = event.target.files
                  dirtyDataType(UpdatedDataType.EntityLogo)
                  setLogoFile(file)

                  fileReader.current.readAsDataURL(file)
                  fileReader.current.onload = () => setImageBase64(fileReader.current.result as string)
                }}
                style={{ display: 'none' }}
              />

              <UploadButtonContainer>
                <Button
                  border={true}
                  onClick={() => inputFileRef && inputFileRef.current?.click()}
                >{i18n.t('entity.edit.change_logo')}</Button>
              </UploadButtonContainer>
            </FlexContainer>
          </Column>
        </Grid>

        <Grid>
          <Column>
            <FlexContainer justify={FlexJustifyContent.End}>
              <Button
                positive
                disabled={!updatedData.length && !storingData}
                onClick={storeEntityData}
                spinner={storingData}
                width={200}
              >{i18n.t('entity.edit.save_changes')}</Button>
            </FlexContainer>
          </Column>
        </Grid>
      </CardBody>
    </CardDiv>
  )
}

const CardBody = styled.div`
  padding: 0 20px 20px;
`
const UploadButtonContainer = styled.div`
  padding-left: 20px;
`