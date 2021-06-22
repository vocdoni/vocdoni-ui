import React from 'react'

import i18n from '../../../i18n'

import { StatusCard } from '../../elements/cards'
import { Column, Grid } from '../../elements/grid'

interface IDashboardActivitySummaryProps {
  activeVotes: number
  upcomingVotes: number
  votesResults: number
  loading?: boolean
}

export const DashboardActivitySummary = ({
  activeVotes,
  upcomingVotes,
  votesResults,
  loading,
}: IDashboardActivitySummaryProps) => {
  return (
    <Grid>
      <StatusCard
        skeleton={loading}
        md={4}
        title={i18n.t('dashboard.active_votes')}
      >
        <h1>{activeVotes}</h1>
      </StatusCard>

      <StatusCard
        skeleton={loading}
        md={4}
        title={i18n.t('dashboard.vote_results')}
      >
        <h1>{votesResults}</h1>
      </StatusCard>

      <StatusCard
        skeleton={loading}
        md={4}
        title={i18n.t('dashboard.upcoming_votes')}
      >
        <h1>{upcomingVotes}</h1>
      </StatusCard>

      {/* <Column lg={3} sm={6}>
        <StatusCard title={i18n.t('dashboard.company_members')}>
          <h1>{companyMembers}</h1>
        </StatusCard>
      </Column> */}
    </Grid>
  )
}
