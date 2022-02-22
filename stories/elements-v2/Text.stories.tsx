import React, { Children } from "react";

import { Row, Col, Card, Text, Button } from "@components/elements-v2";
import { LightningSlashIcon, PenOutlinedIcon } from '@components/elements-v2/icons'
import { ComponentStory } from "@storybook/react";
import { isMobileDevice } from "react-select/src/utils";
export default {
  title: 'Elements V2/Text',
  component: Text,
}
const Template: ComponentStory<typeof Text> = (args) => (
  <Row gutter="xl">
    <Col>
      <Text {...args} />
    </Col>
  </Row>
)
export const Playground = Template.bind({})

const PlaygroundArgs = {
  children: 'Text',
  size: 'md',
  weight: 'bold',
  color: 'dark-blue'
}
Playground.args = PlaygroundArgs

