import { CsvGenerator } from '@lib/csv-generator'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ImportVoterListBase } from './import-voter-list-base'

export const ImportVoterListNormal = () => {
  const { i18n } = useTranslation()
  const requirementsList = [
    i18n.t('votes.new.the_first_row_will_be_used_as_the_name_of_the_fields'),
    i18n.t(
      'votes.new.the_fields_are_case_insensitive_blank_spaces_will_be_ignored'
    ),
  ]

  const csvGenerator = new CsvGenerator(
    [i18n.t('vote.name'), i18n.t('vote.surname'), i18n.t('vote.email')],
    [
      ['John', 'Doe', 'john@doe.com'],
      ['Janine', 'Doe', 'janine@doe.com'],
    ]
  )

  return (
    <ImportVoterListBase
      requirements={requirementsList}
      fileName="template-file.csv"
      linkUrl={csvGenerator.generateUrl()}
    ></ImportVoterListBase>
  )
}
