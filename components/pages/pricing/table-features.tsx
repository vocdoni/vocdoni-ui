import React from 'react'
import styled from 'styled-components'
import Check from 'remixicon/icons/System/checkbox-circle-line.svg'
import { useTranslation } from 'react-i18next'

import { Product } from '@models/Product'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { FeatureName } from '@const/products'
import { colors } from '@theme/colors'

interface ITableFeaturesProps {
  products: Product[]
}

interface IFeatureCellProps {
  product: Product
  feature: FeatureName
}

const FeatureCell = ({ product, feature }: IFeatureCellProps) => (
  <CheckCell>{product.features.list.includes(feature) && <Check width="25px" fill={colors.blueText} />}</CheckCell>
)

interface IFeatureRowProps {
  products: Product[]
  feature: FeatureName
  featureTitle: string
}

const FeatureRow = ({ products, feature, featureTitle }: IFeatureRowProps) => (
  <tr>
    <td>
      <Typography variant={TypographyVariant.Small}>{featureTitle}</Typography>
    </td>

    {products.map((product) => (
      <FeatureCell key={product.id} product={product} feature={feature} />
    ))}
    <td></td>
  </tr>
)

interface ITableFeatureProps {
  products: Product[]
  groupTitle: string
  features: {
    codeName: FeatureName
    title: string
  }[]
}

const TableFeature = ({ products, groupTitle, features }: ITableFeatureProps) => (
  <FeatureTable>
    <thead>
      <tr>
        <th colSpan={4}>
          <Typography variant={TypographyVariant.Body1}>{groupTitle}</Typography>
        </th>
      </tr>
    </thead>

    <tbody>
      {features.map((feature) => (
        <FeatureRow products={products} feature={feature.codeName} featureTitle={feature.title} />
      ))}
    </tbody>
  </FeatureTable>
)

export const TableFeatures = ({ products }: ITableFeaturesProps) => {
  const { i18n } = useTranslation()

  const votingTableFeatures = [
    {
      codeName: FeatureName.VotingSimpleProcess,
      title: i18n.t('pricing.table_features.simple_process'),
    },
    {
      codeName: FeatureName.VotingMultipleAnswers,
      title: i18n.t('pricing.table_features.multiple_answers'),
    },
    {
      codeName: FeatureName.VotingAnonymous,
      title: i18n.t('pricing.table_features.anonymous'),
    },
    {
      codeName: FeatureName.VotingAbstainFromAnswer,
      title: i18n.t('pricing.table_features.abstain_from_answers'),
    },
    {
      codeName: FeatureName.VotingStepByStep,
      title: i18n.t('pricing.table_features.step_by_step_voting'),
    },
    {
      codeName: FeatureName.VotingEndToEndVerifiability,
      title: i18n.t('pricing.table_features.end_to_end_verifiability'),
    },
    {
      codeName: FeatureName.VotingTamperProof,
      title: i18n.t('pricing.table_features.tamper_proof_voting'),
    },
    {
      codeName: FeatureName.VotingIntegrityBlockchain,
      title: i18n.t('pricing.table_features.results_integrity_securely_by_blockchain'),
    },
    {
      codeName: FeatureName.VotingQuestionByQuestion,
      title: i18n.t('pricing.table_features.question_by_question'),
    },
    {
      codeName: FeatureName.VotingRealtime,
      title: i18n.t('pricing.table_features.real_time_voting'),
    },
    {
      codeName: FeatureName.VotingQuadratic,
      title: i18n.t('pricing.table_features.quadratic_voting'),
    },
    {
      codeName: FeatureName.VotingDigitalCertificate,
      title: i18n.t('pricing.table_features.digital_certificate'),
    },
  ]

  const AGMFeatures = [
    {
      codeName: FeatureName.AGMSaveDraft,
      title: i18n.t('pricing.table_features.save_process_as_draft'),
    },
    {
      codeName: FeatureName.AGMTestVotingProcess,
      title: i18n.t('pricing.table_features.test_voting_process'),
    },
    {
      codeName: FeatureName.AGMRealtimeQA,
      title: i18n.t('pricing.table_features.real_time_qa'),
    },
    {
      codeName: FeatureName.AGMVideoConference,
      title: i18n.t('pricing.table_features.video_conference'),
    },
    {
      codeName: FeatureName.AGMStreaming,
      title: i18n.t('pricing.table_features.steaming'),
    },
  ]

  const paymentsFeatures = [
    {
      codeName: FeatureName.PaymentsAcceptPayments,
      title: i18n.t('pricing.table_features.accept_payment'),
    },
    {
      codeName: FeatureName.PaymentsDonationButton,
      title: i18n.t('pricing.table_features.donation_button'),
    },
  ]

  const censusFeatures = [
    {
      codeName: FeatureName.CensusUploadCSV,
      title: i18n.t('pricing.table_features.upload_csv_census')
    },
    {
      codeName: FeatureName.CensusTagging,
      title: i18n.t('pricing.table_features.tagging')
    },
    {
      codeName: FeatureName.CensusSegmentation,
      title: i18n.t('pricing.table_features.segmentation')
    }
  ]

  const insightsFeatures = [
    {
      codeName: FeatureName.InsightsVotingResults,
      title: i18n.t('pricing.table_features.voting_results')
    },
    {
      codeName: FeatureName.InsightsBasicAnalytics,
      title: i18n.t('pricing.table_features.basic_analytics')
    },
    {
      codeName: FeatureName.InsightsAdvancedAnalytics,
      title: i18n.t('pricing.table_features.advanced_analytics')
    },
    {
      codeName: FeatureName.InsightsDownloadPDF,
      title: i18n.t('pricing.table_features.download_pdf')
    }
  ]

  const brandingFeatures = [
    {
      codeName: FeatureName.BrandingCustomLogo,
      title: i18n.t('pricing.table_features.custom_logo')
    },
    {
      codeName: FeatureName.BrandingRemoveVocdoniBranding,
      title: i18n.t('pricing.table_features.remove_vocdoni_branding')
    },
    {
      codeName: FeatureName.BrandingCustomColors,
      title: i18n.t('pricing.table_features.custom_colors')
    },
    {
      codeName: FeatureName.BrandingCustomSubdomain,
      title: i18n.t('pricing.table_features.custom_subdomain')
    }
  ]

  const communicationsFeatures = [
    {
      codeName: FeatureName.CommunicationsVotingCalendar,
      title: i18n.t('pricing.table_features.voting_calendar')
    },
    {
      codeName: FeatureName.CommunicationMewsFeed,
      title: i18n.t('pricing.table_features.news_feed')
    },
    {
      codeName: FeatureName.CommunicationsVotingEmail,
      title: i18n.t('pricing.table_features.user_mailing')
    },
  ]

  const integrationsFeatures = [
    {
      codeName: FeatureName.IntegrationsZappier,
      title: i18n.t('pricing.table_features.zappier')
    },
    {
      codeName: FeatureName.IntegrationsMamilchimp,
      title: i18n.t('pricing.table_features.mail_chimp')
    },
    {
      codeName: FeatureName.IntegrationsCRM,
      title: i18n.t('pricing.table_features.crm')
    },
  ]

  const supportFeatures = [
    {
      codeName: FeatureName.SupportLiveChat,
      title: i18n.t('pricing.table_features.live_chat')
    },
    {
      codeName: FeatureName.SupportPrioritySupport,
      title: i18n.t('pricing.table_features.priority_support')
    },
    {
      codeName: FeatureName.SupportManagedProcess,
      title: i18n.t('pricing.table_features.managed_process')
    },
  ]

  return (
    <>
      <TableFeature
        products={products}
        groupTitle={i18n.t('pricing.table_features.voting')}
        features={votingTableFeatures}
      />

      <hr />

      <TableFeature products={products} groupTitle={i18n.t('pricing.table_features.agm')} features={AGMFeatures} />

      <hr />

      <FeatureTable>
        <thead>
          <tr>
            <th colSpan={4}>
              <Typography variant={TypographyVariant.Body1}>{i18n.t('pricing.table_features.payments')}</Typography>
            </th>
          </tr>
        </thead>

        <tbody>
          {paymentsFeatures.map((feature) => (
            <FeatureRow products={products} feature={feature.codeName} featureTitle={feature.title} />
          ))}
          <tr>
            <CheckCell>{i18n.t('pricing.table_features.payment_fee')}</CheckCell>

            <CheckCell>3,50%</CheckCell>
            <CheckCell>2,50%</CheckCell>
            <CheckCell>1,50%</CheckCell>
            <CheckCell></CheckCell>
          </tr>
        </tbody>
      </FeatureTable>
          
      <hr />

      <TableFeature
        products={products}
        groupTitle={i18n.t('pricing.table_features.census_management')}
        features={censusFeatures}
      />

      <hr />

      <TableFeature
        products={products}
        groupTitle={i18n.t('pricing.table_features.insights_and_metrics')}
        features={insightsFeatures}
      />

      <hr />

      <TableFeature
        products={products}
        groupTitle={i18n.t('pricing.table_features.branding')}
        features={brandingFeatures}
      />

      <hr />

      <TableFeature
        products={products}
        groupTitle={i18n.t('pricing.table_features.communications')}
        features={communicationsFeatures}
      />

      <hr />

      <TableFeature
        products={products}
        groupTitle={i18n.t('pricing.table_features.integrations')}
        features={integrationsFeatures}
      />

      <hr />

      <TableFeature
        products={products}
        groupTitle={i18n.t('pricing.table_features.support')}
        features={supportFeatures}
      />
    </>
  )
}

const FeatureTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`

const CheckCell = styled.td`
  text-align: center;
`
