import React from "react";

import { Col, LinkButton, Row } from "@components/elements-v2";
import { ComponentStory } from "@storybook/react";
import { SettingsIcon } from "@components/elements-v2/icons";
export default {
  title: 'Elements V2/LinkButton',
  component: LinkButton,
}
const Template: ComponentStory<typeof LinkButton> = (args) => <LinkButton {...args} />;

export const Playground = Template.bind({})
export const Showcase = (args) => (
  <Row gutter="lg">
    <Col xs={12} md={3}>
      <Default {...DefaultArgs} />
    </Col>
    <Col xs={12} md={3}>
      <Disabled {...DisabledArgs} />
    </Col>
    <Col xs={12} md={3}>
      <WithIcon {...WithIconArgs} />
    </Col>
    <Col xs={12} md={3}>
      <WithoutLinkIcon {...WithoutLinkIconArgs} />
    </Col>
  </Row>
)
export const Default = Template.bind({})
export const Disabled = Template.bind({})
export const WithIcon = Template.bind({})
export const WithoutLinkIcon = Template.bind({})
const PlaygroundArgs = {
  href: 'https://vocdoni.app',
  children: 'Without icon',
  target: "_blank"
}
const DefaultArgs = {
  href: 'https://vocdoni.app',
  children: 'Without icon',
  target: "_blank"
}
const DisabledArgs = {
  disabled: true,
  children: 'Disabled',
  target: "_blank"
}
const WithIconArgs = {
  children: 'Without icon',
  href: 'https://vocdoni.app',
  icon: <SettingsIcon />,
  target: "_blank"
}
const WithoutLinkIconArgs = {
  children: 'Without link icon',
  hideLinkIcon: true,
  icon: <SettingsIcon />,
  href: 'https://vocdoni.app',
  target: "_blank"
}
Playground.args = PlaygroundArgs
Default.args = DefaultArgs
Disabled.args = DisabledArgs
WithIcon.args = WithIconArgs
WithoutLinkIcon.args = WithoutLinkIconArgs
Showcase.parameters = { controls: { exclude: '.*' } }
