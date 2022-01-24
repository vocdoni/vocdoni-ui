import React from "react";

import { Tag, Col, Row } from "@components/elements-v2";
import { ComponentStory } from "@storybook/react";

export default {
  title: 'Elements V2/Tag',
  component: Tag
}


const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />;

export const Playground = Template.bind({})
export const Showcase = (args) => (
  <Row gutter="lg">
    <Col >
      <Neutral {...NeutralArgs} />
    </Col>
    <Col >
      <Success {...SuccessArgs} />
    </Col>
    <Col>
      <Error {...ErrorArgs} />
    </Col>
    <Col>
      <Info {...InfoArgs} />
    </Col>
    <Col>
      <WithLabel {...WithLabelArgs} />
    </Col>
    <Col>
      <Large {...LargeArgs} />
    </Col>
  </Row>
)
export const Default = Template.bind({})
export const Neutral = Template.bind({})
export const Success = Template.bind({})
export const Error = Template.bind({})
export const Info = Template.bind({})
export const WithLabel = Template.bind({})
export const Large = Template.bind({})
const PlaygroundArgs = {
  children: 'Default tag',
}
const DefaultArgs = {
  children: 'Default tag',
}
const NeutralArgs = {
  variant: 'neutral',
  children: 'Neutral tag',
  size: 'regular',
  fontWeight: 'bold'
}
const SuccessArgs = {
  variant: 'success',
  children: 'Success tag',
  size: 'regular',
  fontWeight: 'bold'
}
const ErrorArgs = {
  variant: 'error',
  children: 'Error tag',
  size: 'regular',
  fontWeight: 'bold'
}
const InfoArgs = {
  variant: 'info',
  children: 'info tag',
  size: 'regular',
  fontWeight: 'bold'
}
const WithLabelArgs = {
  variant: 'success',
  label: 'This is a label',
  children: 'Tag with label',
  size: 'regular',
  fontWeight: 'bold'
}
const LargeArgs = {
  variant: 'neutral',
  size: 'large',
  fontWeight: 'regular',
  children: 'Large tag'
}
Playground.args = DefaultArgs
Default.args = DefaultArgs
Neutral.args = NeutralArgs
Success.args = SuccessArgs
Error.args = ErrorArgs
Info.args = InfoArgs
WithLabel.args = WithLabelArgs
Large.args = LargeArgs
Showcase.parameters = { controls: { exclude: '.*' } }
