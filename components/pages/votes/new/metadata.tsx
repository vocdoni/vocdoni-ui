import React, { ChangeEvent, useEffect, useState } from 'react'
import { checkValidProcessMetadata } from 'dvote-js'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { colors } from 'theme/colors'

import { useProcessCreation } from '@hooks/process-creation'
import { useMessageAlert } from '@hooks/message-alert'
import { useEntity } from '@vocdoni/react-hooks'
import { useWallet } from '@hooks/use-wallet'

import { Question } from '@lib/types'
import { DirtyFields, ErrorFields } from '@lib/validators'
import {
  FileLoaderFormGroup,
  FormGroupVariant,
  InputFormGroup,
  TextareaFormGroup,
} from '@components/blocks/form'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { Button, JustifyContent } from '@components/elements/button'
import { PlazaMetadataKeys } from '@const/metadata-keys'
import { Column, Grid } from '@components/elements/grid'

import { ProcessCreationPageSteps } from '.'
import {
  QuestionGroup,
  QuestionFields,
  createEmptyOption,
} from './question-group'
import { PreviewModal } from './preview-modal'
import { validateMetadata } from './metadata-validator'
import {
  InvalidQuestionsError,
  QuestionError,
} from '@lib/validators/errors/invalid-question-error'
import { useScrollTop } from '@hooks/use-scroll-top'
import { When } from 'react-if'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { TextEditor } from '@components/blocks/text-editor'
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'

export enum MetadataFields {
  Title = 'process-title',
  BrandColor = 'brandColor',
  Description = 'process-description',
  AttachmentLink = 'attachmentUri',
  DiscussionLink = 'discussionUrl',
  StreamLink = 'streamUri',
  Question = 'process-question',
}

const createEmptyQuestion = (): Question => ({
  title: {
    default: '',
  },
  description: {
    default: '',
  },
  choices: [createEmptyOption(0), createEmptyOption(1)],
})

export const FormMetadata = () => {
  const { i18n } = useTranslation()
  useScrollTop()
  const { headerURL, headerFile, metadata, methods } = useProcessCreation()
  const { setAlertMessage } = useMessageAlert()
  const { wallet } = useWallet()
  const { metadata: entityMetadata } = useEntity(wallet?.address)
  const { trackEvent } = useRudderStack()

  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false)
  const [dirtyFields, setDirtyField] = useState<DirtyFields>(new Map())
  const [metadataErrors, setMetadataErrors] = useState<ErrorFields>(new Map())

  const colorPickerEnabled = !!process.env.COLOR_PICKER || false

  const dirtyAllFields = () => {
    const newDirtyFields = new Map([...dirtyFields])

    for (let field in MetadataFields) {
      newDirtyFields.set(MetadataFields[field], true)
    }

    for (let questionIndex in metadata.questions) {
      const choices = metadata.questions[questionIndex].choices
      newDirtyFields.set(
        `question-${QuestionFields.Title}-${questionIndex}`,
        true
      )
      newDirtyFields.set(
        `question-${QuestionFields.Description}-${questionIndex}`,
        true
      )

      for (let choiceIndex in choices) {
        newDirtyFields.set(
          `question-${questionIndex}-choice-${choiceIndex}`,
          true
        )
      }
    }

    setDirtyField(newDirtyFields)
  }

  const handleTogglePreviewModal = () => {
    setShowPreviewModal(!showPreviewModal)
  }

  const handleBlur = (field: MetadataFields) => {
    const newDirtyFields = new Map(dirtyFields)

    setDirtyField(newDirtyFields.set(field, true))
  }

  const handleContinue = () => {
    if (!metadataErrors.size) {
      try {
        const validatedMeta = checkValidProcessMetadata(metadata)
        methods.setRawMetadata(validatedMeta)
        trackEvent(TrackEvents.PROCESS_CREATION_WIZARD_BUTTON_CLICKED, {
          step: ProcessCreationPageSteps.CENSUS,
        })
        methods.setPageStep(ProcessCreationPageSteps.CENSUS)
      } catch (error) {
        setAlertMessage(i18n.t('error.the_vote_details_are_invalid'))
      }
    } else {
      dirtyAllFields()
    }
  }

  const handleUpdateQuestion = (index: number, question: Question) => {
    metadata.questions[index] = question
    methods.setQuestions(metadata.questions)
  }

  const handleCreateQuestion = () => {
    const newQuestions = [...metadata.questions]
    newQuestions.push(createEmptyQuestion())

    methods.setQuestions(newQuestions)
  }

  "Yes#(ipfs://)#(date)"

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...metadata.questions]
    newQuestions.splice(index, 1)

    methods.setQuestions(newQuestions)
  }

  // Only for arbitrary fields within process.metadata.meta[...]
  const handleMeta = (
    fieldName: PlazaMetadataKeys | MetadataFields,
    value: string
  ) => {
    methods.setMetaFields({ [fieldName]: value })
  }

  const getErrorMessage = (field: MetadataFields): string => {
    return dirtyFields.get(field) ? metadataErrors.get(field)?.message : null
  }

  const getQuestionError = (index: number): QuestionError => {
    const questionError: InvalidQuestionsError = metadataErrors.get(
      MetadataFields.Question
    ) as InvalidQuestionsError

    return questionError?.question.get(index)
  }
  useEffect(() => {
    const invalidFields: ErrorFields = validateMetadata(metadata)

    setMetadataErrors(invalidFields)
  }, [metadata])

  return (
    <>
      <Grid>
        <Column md={6} sm={12}>
          <InputFormGroup
            title={i18n.t('vote.title')}
            placeholder={i18n.t('vote.proposal_title')}
            value={metadata.title.default}
            id={MetadataFields.Title}
            error={getErrorMessage(MetadataFields.Title)}
            onBlur={() => handleBlur(MetadataFields.Title)}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              methods.setTitle(e.target.value)
            }
          />
        </Column>

        <Column md={6} sm={12}>
          <FileLoaderFormGroup
            title={i18n.t('vote.header_image')}
            // label={i18n.t('vote.optional_field')}
            maxMbSize={2}
            onSelect={(file) => methods.setHeaderFile(file)}
            onChange={methods.setHeaderURL}
            file={headerFile}
            url={headerURL}
            accept=".jpg,.jpeg,.png,.gif"
          />
        </Column>
      </Grid>

      <Grid>
        <Column md={6} sm={12}>
          <InputFormGroup
            title={i18n.t('vote.pdf_link')}
            label={i18n.t('vote.pdf_link_label')}
            placeholder={i18n.t('vote.pdf_link')}
            helpText={i18n.t('vote.pdf_link_explanation')}
            id={MetadataFields.AttachmentLink}
            value={metadata.meta[MetadataFields.AttachmentLink]}
            error={getErrorMessage(MetadataFields.AttachmentLink)}
            onBlur={() => handleBlur(MetadataFields.AttachmentLink)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleMeta(PlazaMetadataKeys.ATTACHMENT_URI, event.target.value)
            }}
          />
        </Column>

        <Column md={6} sm={12}>
          <InputFormGroup
            title={i18n.t('vote.forum_link')}
            label={i18n.t('vote.forum_link_label')}
            placeholder={i18n.t('vote.forum_link')}
            helpText={i18n.t('vote.forum_link_explanation')}
            id={MetadataFields.DiscussionLink}
            value={metadata.meta[MetadataFields.DiscussionLink]}
            error={getErrorMessage(MetadataFields.DiscussionLink)}
            onBlur={() => handleBlur(MetadataFields.DiscussionLink)}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleMeta(PlazaMetadataKeys.DISCUSSION_URL, event.target.value)
            }
          />
        </Column>
      </Grid>

      <Grid>
        <Column md={6} sm={12}>
          <InputFormGroup
            title={i18n.t('vote.stream_link')}
            label={i18n.t('vote.stream_link_label')}
            placeholder={i18n.t('vote.stream_link')}
            helpText={i18n.t('vote.stream_link_explanation')}
            id={MetadataFields.StreamLink}
            value={metadata.media[MetadataFields.StreamLink]}
            error={getErrorMessage(MetadataFields.StreamLink)}
            onBlur={() => handleBlur(MetadataFields.StreamLink)}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              methods.setMediaStreamURI(event.target.value)
            }
          />
        </Column>
      </Grid>

      <Grid>
        <Column>
          <Typography variant={TypographyVariant.H3}>
            {i18n.t('vote.description')}
          </Typography>
          <TextEditor
            content={metadata.description.default}
            deps={[
              metadata.title,
              metadata.media,
              metadata.meta,
              metadata.questions,
            ]}
            onChange={(content) => {
              methods.setDescription(content)
            }}
            markdown
          />
        </Column>
      </Grid>

      <When condition={colorPickerEnabled}>
        <Grid>
          <Column md={6} sm={12}>
            <InputFormGroup
              title={i18n.t('vote.brand_process_color')}
              placeholder={i18n.t('vote.brand_process_color')}
              label={i18n.t('vote.brand_color_used_on_the_voting_process')}
              id={MetadataFields.BrandColor}
              helpText={i18n.t(
                'vote.these_color_will_be_used_to_improve_the_look_and_feel'
              )}
              type="color"
              value={metadata.meta[MetadataFields.BrandColor]}
              error={getErrorMessage(MetadataFields.BrandColor)}
              onBlur={() => handleBlur(MetadataFields.BrandColor)}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleMeta(MetadataFields.BrandColor, event.target.value)
              }
            />
          </Column>
        </Grid>
      </When>

      {metadata.questions.map((question: Question, index: number) => (
        <QuestionGroup
          key={index}
          canBeDeleted={metadata.questions.length > 1}
          question={question}
          index={index}
          error={getQuestionError(index)}
          dirtyFields={dirtyFields}
          onDirtyField={handleBlur}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      ))}

      <Button
        icon={
          <img
            src="/images/vote/plus.svg"
            alt={i18n.t('vote.plus_icon_alt')}
            color={colors.textAccent2}
          />
        }
        justify={JustifyContent.Left}
        border
        wide
        onClick={handleCreateQuestion}
      >
        <AddQuestionText>{i18n.t('vote.add_new_question')}</AddQuestionText>
      </Button>

      <Grid>
        <Column>
          <FlexContainer justify={FlexJustifyContent.End}>
            <ButtonContainer>
              <Button color={colors.accent1} onClick={handleTogglePreviewModal}>
                {i18n.t('action.preview_proposal')}
              </Button>
            </ButtonContainer>

            <ButtonContainer>
              <Button positive onClick={handleContinue}>
                {i18n.t('action.continue')}
              </Button>
            </ButtonContainer>
          </FlexContainer>
        </Column>
      </Grid>

      <PreviewModal
        visible={showPreviewModal}
        onClose={handleTogglePreviewModal}
        entityName={entityMetadata?.name.default}
        entityLogo={entityMetadata?.media.avatar}
      />
    </>
  )
}

const ButtonContainer = styled.div`
  margin-left: 15px;
  margin-top: 20px;
`

const AddQuestionText = styled.p`
  font-weight: 500;
  font-size: 20px;
  margin: 6px 10px;
`
