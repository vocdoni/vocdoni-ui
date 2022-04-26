import React, { Children } from 'react'

import { Row, Col, Banner } from '@components/elements-v2'
import { SettingsCard } from '@components/pages/pub/votes/components/settings-card'
import { ComponentStory } from '@storybook/react'
import { WaitingBanner } from '@components/blocks-v2'
import { useTranslation } from 'react-i18next'
export default {
  title: 'Blocks V2/WaitingMessages',
  component: WaitingBanner,
}
const Template: ComponentStory<typeof SettingsCard> = (args) => {
  return (
    <Row gutter="xl">
      <Col xs={12} md={6}>
        <WaitingBanner {...WaitingBannerArgs} />
      </Col>
      <Col xs={12} md={3}>
        <WaitingBanner {...MobileWaitingBannerArgs} />
      </Col>
    </Row>
  )
}

export const Showcase = Template.bind({})

// const { i18n } = useTranslation()
const WaitingBannerArgs = {
  messages: [
    "This is the message number 1, but it will change to message <strong>number</strong> 2 in as moment, I can also have links like <a href='https://vocdoni.app' target='_blank'>this</a> because I render HTML.",
    'Whoah! Message number 2 is here :)',
  ],
  intervalTime: 10000,
  forceMobile: false,
}
const MobileWaitingBannerArgs = {
  messages: [
    "This is the message number 1, but it will change to message <strong>number</strong> 2 in as moment, I can also have links like <a href='https://vocdoni.app' target='_blank'>this</a> because I render HTML.",
    'Whoah! Message number 2 is here :)',
    'I have an interval time of 4s (4000ms)',
  ],
  intervalTime: 4000,
  forceMobile: true,
}
