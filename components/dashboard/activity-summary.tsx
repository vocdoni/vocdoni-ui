import React from 'react'

import i18n from '../../i18n'

import { StatusCard } from '../cards'
import { Column, Grid } from '../grid'

interface IDashboardActivitySummaryProps {
  activeVotes: number
  upcomingVotes: number
  votesResults: number
}

export const DashboardActivitySummary = ({
  activeVotes,
  upcomingVotes,
  votesResults,
}: IDashboardActivitySummaryProps) => {
  return (
    <Grid>
      <StatusCard lg={4} title={i18n.t('dashboard.active_votes')}>
        <h1>{activeVotes}</h1>
      </StatusCard>

      <StatusCard lg={4} title={i18n.t('dashboard.upcoming_votes')}>
        <h1>{upcomingVotes}</h1>
      </StatusCard>

      <StatusCard lg={4} title={i18n.t('dashboard.vote_results')}>
        <h1>{votesResults}</h1>
      </StatusCard>

      {/* <Column lg={3} sm={6}>
        <StatusCard title={i18n.t('dashboard.company_members')}>
          <h1>{companyMembers}</h1>
        </StatusCard>
      </Column> */}
    </Grid>
  )
}
