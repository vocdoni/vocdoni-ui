import React, { ChangeEvent, useState, useRef, useEffect } from 'react'
import Modal from 'react-rainbow-components/components/Modal'
import Router from 'next/router'
import { EntityMetadata } from 'dvote-js'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { IEntityRegistryState } from 'recoil/atoms/entity-registry'

import { Button } from '@components/elements/button'
import { CardDiv } from '@components/elements/cards'
import { ConfirmModal } from '@components/blocks/confirm-modal'
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
  EntityLogo = 'logo',
  EntityHeader = 'header'
}

export interface IEntityData {
  registryData: IEntityRegistryState,
  metadata: EntityMetadata,
  logoFile: File,
  headerFile: File,
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
  const { i18n } = useTranslation()
  const [updatedData, setUpdatedData] = useState<UpdatedDataType[]>([]);
  const [name, setName] = useState(entityRegistryData?.name)
  const [email, setEmail] = useState(entityRegistryData?.email)
  const [type, setType] = useState<string>(entityRegistryData?.type)
  const [size, setSize] = useState<number>(entityRegistryData?.size)
  const [description, setDescription] = useState(entityMetadata?.description.default)
  const [imageBase64, setImageBase64] = useState<string>()
  const [headerImageBase64, setHeaderImageBase64] = useState<string>()
  const [entityDataErrors, setEntityDataErrors] = useState<ErrorFields>(new Map())
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [logoFile, setLogoFile] = useState<File>()
  const [headerFile, setHeaderFile] = useState<File>()
  const [storingData, setStoringData] = useState<boolean>(false)
  const [showExitConfirmModal, setShowExitConfirmModal] = useState<boolean>(false)

  const { setAlertMessage } = useMessageAlert()

  const inputFileRef = useRef<HTMLInputElement>()
  const headerInputFileRef = useRef<HTMLInputElement>()
  const fileReader = useRef<FileReader>(new FileReader())

  const entityType = SELECT_ORGANIZATION_TYPE.find((option: ISelectOption) => option.value === type)
  const entitySize = SELECT_ORGANIZATION_SIZE.find((option: ISelectOption) => option.value === size)

  const urlPrevent = useRef('')
  const exitWithoutChanges = useRef(false)

  useEffect(() => {
    const beforeUnload = (newRoute: string): void => {
      if (updatedData.length && !exitWithoutChanges.current) {
        urlPrevent.current = newRoute
        setShowExitConfirmModal(true)
        throw 'Prevent route change'
      }
    }

    Router.events.on('routeChangeStart', beforeUnload)

    return () => Router.events.off("routeChangeStart", beforeUnload)
  }, [updatedData])

  useEffect(() => {
    if (!checkUpdatedData()) {
      return setUpdatedData([])
    }
  }, [email, name, type, size, description])

  const checkUpdatedData = (): boolean => {
    const emailUpdated = entityRegistryData?.email !== email
    const nameUpdated = entityRegistryData?.name !== name
    const typeUpdated = entityRegistryData?.type !== type
    const sizeUpdated = entityRegistryData?.size !== size
    const descriptionUpdated = entityMetadata?.description.default !== description

    return emailUpdated || nameUpdated || typeUpdated || sizeUpdated || descriptionUpdated
  }

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
      headerFile,
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
      setShowConfirmModal(false)
    } catch (error) {
      if (error instanceof EntityNameAlreadyExistError) {
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
      ></CardTextHeader>

      <CardBody>
        <Grid>
          <Column sm={12} md={6}>
            <InputFormGroup
              label={i18n.t('entity.edit.name_of_the_entity')}
              type='text'
              id='entity-name'
              error={entityDataErrors.get(EntityFields.Name)?.message}
              value={name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dirtyDataType(UpdatedDataType.EntityRegistry)
                dirtyDataType(UpdatedDataType.EntityMetadata)
                setName(event.target.value)
              }}
            />
          </Column>

          <Column sm={12} md={6}>
            <InputFormGroup
              label={i18n.t('entity.edit.contact_email')}
              type='text'
              error={entityDataErrors.get(EntityFields.Email)?.message}
              id='entity-email'
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
            <Typography variant={TypographyVariant.ExtraSmall}>{i18n.t('entity.edit.jpg_png_gif')}</Typography>

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

          <Column>
            <Typography variant={TypographyVariant.H3} margin='0 0 10px'>{i18n.t('entity.edit.entity_header')}</Typography>
            <Typography variant={TypographyVariant.ExtraSmall}>{i18n.t('entity.edit.jpg_png_gif')}</Typography>

            <FlexContainer alignItem={FlexAlignItem.Center}>
              <ImageContainer width='200px' height='auto'>
                {headerImageBase64 ? <Image src={`${headerImageBase64}`} /> : <Image src={entityMetadata?.media.header} />}
              </ImageContainer>

              <input
                type='file'
                ref={headerInputFileRef}
                onChange={(event) => {
                  const [file] = event.target.files
                  dirtyDataType(UpdatedDataType.EntityHeader)
                  setHeaderFile(file)

                  fileReader.current.readAsDataURL(file)
                  fileReader.current.onload = () => setHeaderImageBase64(fileReader.current.result as string)
                }}
                style={{ display: 'none' }}
              />

              <UploadButtonContainer>
                <Button
                  border={true}
                  onClick={() => headerInputFileRef && headerInputFileRef.current?.click()}
                >{i18n.t('entity.edit.change_header')}</Button>
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
                onClick={() => setShowConfirmModal(true)}
                width={200}
              >{i18n.t('entity.edit.save_changes')}</Button>
            </FlexContainer>
          </Column>
        </Grid>
      </CardBody>

      <Modal
        isOpen={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <Grid>
          <Column>
            <Typography variant={TypographyVariant.Body2}>{i18n.t('entity.edit.are_you_sure_you_want_update_your_entity_data')}</Typography>
          </Column>
        </Grid>

        <Grid>
          <Column sm={6}>
            <Button
              negative
              onClick={() => setShowConfirmModal(false)}
              wide
            >{i18n.t('entity.edit.cancel')}</Button>
          </Column>

          <Column sm={6}>
            <Button
              positive
              onClick={() => storeEntityData()}
              spinner={storingData}
              wide
            >{i18n.t('entity.edit.update')}</Button>
          </Column>
        </Grid>
      </Modal>

      <ConfirmModal
        isOpen={showExitConfirmModal}
        body={i18n.t('entity.edit.are_you_sure_you_want_exit_without_save_changes')}
        onCancel={() => setShowExitConfirmModal(false)}
        onConfirm={() => { 
          exitWithoutChanges.current = true
          Router.router.push(urlPrevent.current)
        }}
      />
    </CardDiv>
  )
}

const CardBody = styled.div`
  padding: 0 20px 20px;
`
const UploadButtonContainer = styled.div`
  padding-left: 20px;
`