import { CsvGenerator } from '@lib/csv-generator'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ImportVoterListBase } from './import-voter-list-base'

export const ImportVoterListWeighted = () => {
  const { i18n } = useTranslation()
  const requirementsList = [
    i18n.t('votes.new.the_first_row_will_be_used_as_the_name_of_the_fields'),
    i18n.t('votes.new.the_weighted_voted_should_always_come_the_first_column'),
    i18n.t('votes.new.the_voting_power_should_be_above'),
    i18n.t(
      'votes.new.the_fields_are_case_insensitive_blank_spaces_will_be_ignored'
    ),
  ]

  const csvGenerator = new CsvGenerator(
    [i18n.t('vote.voting_power'), i18n.t('vote.name'), i18n.t('vote.surname'), i18n.t('vote.email')],
    [
      [1, 'John', 'Doe', 'john@doe.com'],
      [4,'Janine', 'Doe', 'janine@doe.com'],
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
