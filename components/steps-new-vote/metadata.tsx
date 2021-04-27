import React, { ChangeEvent, useEffect, useState } from 'react'
import { checkValidProcessMetadata } from 'dvote-js'
import styled from 'styled-components'
import cloneDeep from 'lodash/cloneDeep'

import { useProcessCreation } from '../../hooks/process-creation'
import { useMessageAlert } from '../../hooks/message-alert'
import i18n from '../../i18n'

import { Column, Grid } from '../grid'
import { Button, JustifyContent } from '../button'
import { FileLoaderFormGroup, InputFormGroup, TextareaFormGroup } from '../form'
import { SectionText } from '../text'

import { ProcessCreationPageSteps } from '.'
import { IQuestion, QuestionGroup } from './question-group'
import {
  ErrorFields,
  createEmptyQuestion,
  validateMetadata,
} from './metadata-helper'
import { PlazaMetadataKeys } from '../../const/metadata-keys'

export enum MetadataFields {
  Title = 'process-title',
  Description = 'process-description',
  PdfLink = 'pdf-url',
  ForumLink = 'forum-url',
  StreamLink = 'stream-url',
  Question = 'process-question',
}

export const FormMetadata = () => {
  const {
    headerURL,
    headerFile,
    metadata,
    methods,
  } = useProcessCreation()
  const { setAlertMessage } = useMessageAlert()

  const [metadataCompleted, setMetadataCompleted] = useState<boolean>(false)
  const onPreview = () => {
    // TODO:
  }

  const handleContinue = () => {
    try {
      const validatedMeta = checkValidProcessMetadata(metadata)
      methods.setRawMetadata(validatedMeta)

      methods.setPageStep(ProcessCreationPageSteps.CENSUS)
    } catch (error) {
      setAlertMessage(i18n.t('error.the_vote_details_are_invalid'))
    }
  }

  const handleUpdateQuestion = (index: number, question: IQuestion) => {
    metadata.questions[index] = question
    methods.setQuestions(metadata.questions)
  }

  const handleCreateQuestion = () => {
    const newQuestions = [...metadata.questions]
    newQuestions.push(createEmptyQuestion())

    methods.setQuestions(newQuestions)
  }

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...metadata.questions]
    newQuestions.splice(index, 1)

    methods.setQuestions(newQuestions)
  }

  // Only for arbitrary fields within process.metadata.meta[...]
  const handleMeta = (fieldName: PlazaMetadataKeys, value: string) => {
    methods.setMetaFields({ [fieldName]: value })
  }

  useEffect(() => {
    const invalidFields: ErrorFields = validateMetadata(metadata)
    const newMetadataCompleted = !invalidFields.size

    if (newMetadataCompleted !== metadataCompleted) {
      setMetadataCompleted(newMetadataCompleted)
    }
  }, [metadata])

  return (
    <>
      <Grid>
        <Column md={6} sm={12}>
          <InputFormGroup
            title={i18n.t('vote.new_vote')}
            label={i18n.t('vote.title')}
            placeholder={i18n.t('vote.title')}
            value={metadata.title.default}
            id={MetadataFields.Title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              methods.setTitle(e.target.value)
            }
          />

          <FileLoaderFormGroup
            title={i18n.t('vote.header')}
            label={i18n.t('vote.optional_introduction')}
            onSelect={(file) => methods.setHeaderFile(file)}
            onChange={methods.setHeaderURL}
            file={headerFile}
            url={headerURL}
            accept=".jpg,.jpeg,.png,.gif"
          />
        </Column>

        <Column md={6} sm={12}>
          <TextareaFormGroup
            title={i18n.t('vote.description')}
            label={i18n.t('vote.brief_description')}
            placeholder={i18n.t('vote.brief_description')}
            id={MetadataFields.Description}
            rows={10}
            value={metadata.description.default}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              methods.setDescription(e.target.value)
            }
          />
        </Column>
      </Grid>

      <Grid>
        <Column md={6} sm={12}>
          <InputFormGroup
            title={i18n.t('vote.pdf_link')}
            label={i18n.t('vote.pdf_link_label')}
            placeholder={i18n.t('vote.pdf_link')}
            id={MetadataFields.PdfLink}
            value={metadata.meta[MetadataFields.PdfLink]}
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
            id={MetadataFields.ForumLink}
            value={metadata.meta[MetadataFields.ForumLink]}
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
            id={MetadataFields.StreamLink}
            value={metadata.meta[MetadataFields.StreamLink]}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              methods.setMediaStreamURI(event.target.value)
            }
          />
        </Column>
      </Grid>

      {metadata.questions.map((question: IQuestion, index: number) => (
        <QuestionGroup
          key={index}
          canBeDeleted={metadata.questions.length > 1}
          question={question}
          index={index}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      ))}

      <Button
        icon={
          <img src="/images/vote/plus.svg" alt={i18n.t('vote.plus_icon_alt')} />
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
          <BottomDiv>
            {/* <Button
              negative
              // onClick=
            >
              {i18n.t('action.preview_proposal')}
            </Button> */}
            <Button
              positive
              onClick={handleContinue}
              large
              disabled={!metadataCompleted}
            >
              {i18n.t('action.continue')}
            </Button>
          </BottomDiv>
        </Column>
      </Grid>
    </>
  )
}

const AddQuestionContainer = styled.div`
  display: flex;
`

const AddQuestionImageContainer = styled.div`
  margin-right: 20px;
`

const BottomDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`

const AddQuestionText = styled(SectionText)`
  font-weight: 500;
  font-size: 20px;
  margin: 6px 10px;
`
