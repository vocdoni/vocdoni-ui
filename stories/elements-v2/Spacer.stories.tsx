import React, { Children } from "react";

import { Row, Spacer, Col, Card, Text, Button } from "@components/elements-v2";
import { LightningSlashIcon, PenOutlinedIcon } from '@components/elements-v2/icons'
import { ComponentStory } from "@storybook/react";
import { isMobileDevice } from "react-select/src/utils";
export default {
  title: 'Elements V2/Spacer',
  component: Spacer,
}
const Template: ComponentStory<typeof Spacer> = (args) => (
  <Row gutter="xl">
    <Col xs={12}>
      <Card />
      <Spacer {...args} />
      <Card />
    </Col>
  </Row>
)
export const Playground = Template.bind({})

const PlaygroundArgs = {
  direction: 'vertical',
  size: 'md',
}
Playground.args = PlaygroundArgs

Playground.argTypes = {
  ref: { control: { disable: true } },
  theme: { table: { disable: true } },
  as: { table: { disable: true } },
  forwardedAs: { table: { disable: true } },
}
