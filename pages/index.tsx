import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { Button } from '../components/elements/button'
import { useIsMobile } from '../hooks/use-window-size'
import { CREATE_ACCOUNT_PATH } from '@const/routes'
import {
  TextAlign,
  Typography,
  TypographyVariant,
} from '@components/elements/typography'
import { colors } from 'theme/colors'
import { FlexAlignItem } from '@components/elements/flex'
import { ImageContainer } from '@components/elements/images'
import { Grid, Column } from '@components/elements/grid'
import { FeatureSection } from '@components/pages/home/components/feature'
import { HeroBanner } from '@components/pages/home/components/hero-banner'
import { CompanyLogos } from '@components/pages/home/components/company-logos'
import { SliderSection } from '@components/pages/home/components/slider-section'
import { SplitSection } from '@components/pages/home/components/section'
import { CardDiv } from '@components/elements/cards'
import { EmptyProviders } from '@components/pages/app/providers/empty-providers'

import { sizes } from 'theme/sizes'

// MAIN COMPONENT
const IndexPage = () => {
  const { i18n } = useTranslation()
  const isMobile = useIsMobile()

  return (
    <div>
      <HeroBanner />

      <BlockContainer>
        <CompanyLogos />
      </BlockContainer>

      <Section>
        <BlockContainer>
          <Typography
            variant={TypographyVariant.Small}
            color={colors.textAccent1}
          >
            {i18n.t('home.why_vocdoni')}
          </Typography>
          <Grid>
            <Column sm={12} md={7}>
              <Typography variant={TypographyVariant.H1}>
                {i18n.t(
                  'home.the_ultimate_solution_to_manage_your_organization'
                )}
              </Typography>
            </Column>
          </Grid>

          <Grid>
            <Column md={4} sm={12}>
              <FeatureSection
                title={i18n.t('home.secure_voting')}
                subtitle={i18n.t(
                  'home.the_most_flexible_and_secure_voting_protocol_to_organize'
                )}
                image={
                  <ImageContainer width="40px">
                    <img
                      src="/images/home/features/secure.png"
                      alt={i18n.t('home.secure_image_alt')}
                    />
                  </ImageContainer>
                }
              />
            </Column>

            <Column md={4} sm={12}>
              <FeatureSection
                title={i18n.t('home.easy_to_organize')}
                subtitle={i18n.t(
                  'home.organize_your_amg_or_board_meetings_and_results'
                )}
                image={
                  <ImageContainer width="40px">
                    <img
                      src="/images/home/features/easy.png"
                      alt={i18n.t('home.easy_image_alt')}
                    />
                  </ImageContainer>
                }
              />
            </Column>

            <Column md={4} sm={12}>
              <FeatureSection
                title={i18n.t('home.coordinate')}
                subtitle={i18n.t(
                  'home.far_beyond_voting_vocdoni_is_a_set_off_tools'
                )}
                image={
                  <ImageContainer width="40px">
                    <img
                      src="/images/home/features/coordination.png"
                      alt={i18n.t('home.coordinate_image_alt')}
                    />
                  </ImageContainer>
                }
              />
            </Column>
          </Grid>
        </BlockContainer>
      </Section>

      <Section>
        <BlockContainer>
          <SliderSection />
        </BlockContainer>
      </Section>


      <Section>
        <BlockContainer>
          <SplitSection
            reverse
            imageSrc="/images/home/section-2/tablet-census.png"
            imageAltText={i18n.t('home.table_census_alt')}
            subtitle={i18n.t('home.easy_manage')}
            title={i18n.t('home.manage_your_member_base')}
            textContent={i18n.t(
              'home.dont_waste_time_wondering_about_how_to_identify'
            )}
          />
        </BlockContainer>
      </Section>

      <Section background='#FEFEFF'>
        <BlockContainer>
          <SplitSection
            imageSrc="/images/home/section-3/tablet-live.png"
            imageAltText={i18n.t('home.table_live_alt')}
            subtitle={i18n.t('home.bring_a_human_side')}
            title={i18n.t('home.be_present_in_online_or_hybrid_events')}
            textContent={i18n.t(
              'home.easily_embed_videos_and_live_stream_from_youtube'
            )}
          />
        </BlockContainer>
      </Section>


      <Section>
        <BlockContainer>
          <SplitSection
            imageSrc="/images/home/section-5/color-picker.png"
            imageAltText={i18n.t('home.brand_image_alt')}
            subtitle={i18n.t('home.your_brand_matters')}
            title={i18n.t('home.make_your_social_base_feel_at_home')}
            textContent={i18n.t(
              'home.personalize_your_voting_process_with_your_corporate'
            )}
          />
        </BlockContainer>
      </Section>

      <Section>
        <BlockContainer>
          <Grid>
            <Column md={3} sm={12}>
              <FeatureSection
                title={i18n.t('home.get_instant_results')}
                subtitle={i18n.t(
                  'home.you_and_your_social_base_will_be_able_to_se_the_results'
                )}
                image={
                  <ImageContainer width="36px">
                    <img
                      src="/images/home/features/instant.png"
                      alt={i18n.t('home.instant_image_alt')}
                    />
                  </ImageContainer>
                }
              />
            </Column>

            <Column md={3} sm={12}>
              <FeatureSection
                title={i18n.t('home.choose_the_time_frame')}
                subtitle={i18n.t('home.you_cant_set_the_start_and_end_dates')}
                image={
                  <ImageContainer width="36px">
                    <img
                      src="/images/home/features/time-frame.png"
                      alt={i18n.t('home.time_frame_image_alt')}
                    />
                  </ImageContainer>
                }
              />
            </Column>

            <Column md={3} sm={12}>
              <FeatureSection
                title={i18n.t('home.notify_your_community')}
                subtitle={i18n.t(
                  'home.all_you_have_to_do_is_email_entire_social_base'
                )}
                image={
                  <ImageContainer width="36px">
                    <img
                      src="/images/home/features/notify.png"
                      alt={i18n.t('home.notify_image_alt')}
                    />
                  </ImageContainer>
                }
              />
            </Column>

            <Column md={3} sm={12}>
              <FeatureSection
                title={i18n.t('home.all_in_one_solution')}
                subtitle={i18n.t(
                  'home.the_voting_process_includes_all_the_requirements_for_your_voting_process'
                )}
                image={
                  <ImageContainer width="36px">
                    <img
                      src="/images/home/features/all-in-one.png"
                      alt={i18n.t('home.all_in_one_image_alt')}
                    />
                  </ImageContainer>
                }
              />
            </Column>
          </Grid>
        </BlockContainer>
      </Section>

      <Section background='linear-gradient(101.89deg, #F1FFDF 17.32%, #E1FFFF 68.46%);'>
        <BlockContainer>
          <Grid>
            <Column sm={12} md={6}>
              <Typography
                variant={TypographyVariant.H1}
              >
                {i18n.t('home.a_cutting_edge_voting_protocol')}
              </Typography>
              <Typography
                variant={TypographyVariant.Small}
              >
                {i18n.t('home.leveraging_on_decentalized_technologies')}
              </Typography>
              <CuttingEdgeFeaturesContainer>
                <ImageContainer width="50px">
                  <img
                    src="/images/home/cutting-edge/censorship.png"
                    alt={i18n.t('home.censorship_image_alt')}
                  />
                </ImageContainer>
                <ImageContainer width="60px">
                  <img
                    src="/images/home/cutting-edge/verifiable.png"
                    alt={i18n.t('home.verifiable_image_alt')}
                  />
                </ImageContainer>
                <ImageContainer width="70px">
                  <img
                    src="/images/home/cutting-edge/open-source.png"
                    alt={i18n.t('home.open_source_image_alt')}
                  />
                </ImageContainer>
                <ImageContainer width="44px">
                  <img
                    src="/images/home/cutting-edge/scalable.png"
                    alt={i18n.t('home.scalable_image_alt')}
                  />
                </ImageContainer>
                <ImageContainer width="56px">
                  <img
                    src="/images/home/cutting-edge/anonymous.png"
                    alt={i18n.t('home.anonymous_image_alt')}
                  />
                </ImageContainer>
                <ImageContainer width="58px">
                  <img
                    src="/images/home/cutting-edge/inexpensive.png"
                    alt={i18n.t('home.inexpensive_image_alt')}
                  />
                </ImageContainer>
              </CuttingEdgeFeaturesContainer>
            </Column>

            <Column sm={12} md={6}>
              <ImageContainer width="400px" alignItem={FlexAlignItem.Center}>
                <img
                  src="/images/home/cutting-edge/edge-protocol.png"
                  alt={i18n.t('home.edge_protocol_image_alt')}
                />
              </ImageContainer>
            </Column>
          </Grid>
        </BlockContainer>
      </Section>

      <Section >
        <BlockContainer>
          <Typography variant={TypographyVariant.H1} align={TextAlign.Center}>
            {i18n.t('home.frequently_asked_question')}
          </Typography>
          <Typography align={TextAlign.Center}>
            {i18n.t('home.have_questions_we_have_answers')}
          </Typography>

          <div>
            <a target='_blank' href='https://help.aragon.org/article/59-what-is-vocdoni'>
              <QuestionCard>
                <Typography>{i18n.t('home.what_is_vocdoni')}</Typography>
              </QuestionCard>
            </a>
            <a target='_blank' href='https://help.aragon.org/article/61-is-my-data-safe-with-vocodoni'>
              <QuestionCard>
                <Typography>{i18n.t('home.is_my_data_safe_with_vocdoni')}</Typography>
              </QuestionCard>
            </a>
            <a target='_blank' href='https://help.aragon.org/article/62-as-an-organization-what-can-i-do-with-vocdoni'>
              <QuestionCard>
                <Typography>{i18n.t('home.as_an_organization_wat_cant_i_do_with_vocdoni')}</Typography>
              </QuestionCard>
            </a>
          </div>
        </BlockContainer>
      </Section>

      <Section>
        <BlockContainer>
          <ReadyToStartCard>
            <Grid>
              <Column sm={12} md={6}>
                <ReadyTextContainer>
                  <Typography variant={TypographyVariant.H1}>
                    {i18n.t('home.ready_to_start')}
                    <br />
                    <strong>{i18n.t('home.try_vocdony_now')}</strong>
                  </Typography>

                  <Typography>
                    {i18n.t(
                      'home.a_full_anonymous_voting_system_ensuring_data_availability_and_anti_censorship'
                    )}
                  </Typography>
                </ReadyTextContainer>
              </Column>

              <Column sm={12} md={6}>
                <ImageContainer width="500px">
                  <img
                    src="/images/home/pc.png"
                    alt={i18n.t('home.computer_with_vocdoni_alt')}
                  />
                </ImageContainer>
              </Column>
            </Grid>
          </ReadyToStartCard>
        </BlockContainer>
      </Section>
    </div>
  )
}

IndexPage['Providers'] = EmptyProviders

const ReadyTextContainer = styled.div`
  margin: 40px 0 40px 40px;
`

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  & > a {
    margin-right: 20px;
  }
`

const ReadyToStartCard = styled(CardDiv)`
  background: linear-gradient(101.89deg, #f1ffdf 17.32%, #e1ffff 68.46%);
`

const QuestionCard = styled(CardDiv)`
  max-width: 900px;
  margin: 10px auto;
  padding-right: 80px;
  position: relative;

  &::after {
    text-align: center;
    line-height: 40px;
    color: #000;
    position: absolute;
    font-size: 30px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    right: 20px;
    top: 23px;
    background-color: #dfebf7;
    content: '>';
  }
`

const Section = styled.section<{ background?: string }>`
  padding: 30px 0;
  ${({ background }) => background ? `background: ${background};` : ''}
`

const BlockContainer = styled.div`
  max-width: ${sizes.laptopL * 0.8}px;
  margin: auto;
  padding: 0 15px;
`


const CuttingEdgeFeaturesContainer = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: start;

  & > div {
    margin-right: 20px;
  }
`
export default IndexPage
