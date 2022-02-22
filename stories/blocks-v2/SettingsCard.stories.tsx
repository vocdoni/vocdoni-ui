import React, { Children } from "react";

import { Row, Col, Banner } from "@components/elements-v2";
import { SettingsCard } from '@components/pages/pub/votes/components/settings-card'
import { ComponentStory } from "@storybook/react";
export default {
  title: 'Blocks V2/SettingsCard',
  component: SettingsCard,
}
const Template: ComponentStory<typeof SettingsCard> = (args) => {
  return (
    <Row gutter="xl">
      <Col xs={12} md={4} lg={2}>
        <SettingsCard {...args} />
      </Col>
    </Row>
  )
}

export const Showcase = Template.bind({})
