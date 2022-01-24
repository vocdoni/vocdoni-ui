import React, { Children } from "react";

import { Row, Col, Card, Text, Button } from "@components/elements-v2";
import { LightningSlashIcon, PenOutlinedIcon } from '@components/elements-v2/icons'
import { ComponentStory } from "@storybook/react";
import { isMobileDevice } from "react-select/src/utils";
import { Disabled } from "./LinkButton.stories";
export default {
  title: 'Elements V2/Button',
  component: Button,
}
const Template: ComponentStory<typeof Button> = (args) => (
  <Row gutter="xl">
    <Col>
      <Button {...args} />
    </Col>
  </Row>
)
export const Playground = Template.bind({})
export const Showcase = (args) => (
  <>
    <Row gutter="xl">
      <Col xs={12}>
        <Text size="md" weight="bold" color="dark-blue"> Light variant </Text>
      </Col>
      <Col>
        <Light {...LightArgs} />
      </Col>
      <Col>
        <Light {...LightColorArgs} />
      </Col>
    </Row>
    <Row gutter="xl">
      <Col xs={12}>
        <Text size="md" weight="bold" color="dark-blue"> Primary variant </Text>
      </Col>
      <Col>
        <Primary  {...PrimaryArgs} />
      </Col>
      <Col>
        <Primary  {...PrimarySizeArgs} />
      </Col>
      {/* <Col>
        <Primary  {...PrimaryDisabledArgs} />
      </Col> */}
      <Col>
        <Primary  {...PrimaryIconLeftArgs} />
      </Col>
      <Col>
        <Primary  {...PrimaryIconRightArgs} />
      </Col>
    </Row>
    <Row gutter="xl">
      <Col xs={12}>
        <Text size="md" weight="bold" color="dark-blue"> White variant </Text>
      </Col>
      <Col>
        <Outlined  {...OutlinedArgs} />
      </Col>
      <Col>
        <Outlined  {...OutlinedColorArgs} />
      </Col>
    </Row>
    <Row gutter="xl">
      <Col xs={12}>
        <Text size="md" weight="bold" color="dark-blue"> White variant </Text>
      </Col>
      <Col>
        <White  {...WhiteArgs} />
      </Col>
      <Col>
        <White  {...WhiteColorArgs} />
      </Col>
    </Row >
  </>
)
export const Primary = Template.bind({})
export const Light = Template.bind({})
export const Outlined = Template.bind({})
export const White = Template.bind({})

const LightArgs = {
  variant: 'light',
  children: 'Light Button',
}
const LightColorArgs = {
  variant: 'light',
  children: 'Light Button w color',
  color: '#a1a',
}
const PrimaryArgs = {
  variant: 'primary',
  children: 'Primary Button'
}
const PrimarySizeArgs = {
  variant: 'primary',
  children: 'Primary Button Large',
  size: 'lg'
}
const PrimaryIconRightArgs = {
  variant: 'primary',
  children: 'Primary Button w-icon',
  iconLeft: { name: 'download', size: 24}
}
const PrimaryIconLeftArgs = {
  variant: 'primary',
  children: 'Primary Button w icon',
  iconLeft: <PenOutlinedIcon />
}
// const PrimaryDisabledArgs = {
//   variant: 'primary',
//   children: 'Primary Button disbled',
//   disabled: true,
// }
const OutlinedArgs = {
  variant: 'outlined',
  children: 'Outlined Button'
}
const OutlinedColorArgs = {
  variant: 'outlined',
  children: 'Outlined w color',
  color: '#a1a',
  iconLeft: { name: 'download', size: 24}
}
const WhiteArgs = {
  variant: 'white',
  children: 'White Button',
}
const WhiteColorArgs = {
  variant: 'white',
  children: 'White Button w color',
  color: '#a1a',
  iconLeft: { name: 'download', size: 24},
  // disabled: true
}
const PlaygroundArgs = {
  children: 'The Button',
  variant: 'primary'
}
const ArgTypes = {
  iconLeft: {
    control: {
      type: 'select',
      options: {
        noIcon: '',
        withIcon: <img src="/images/vote/authenticate-icon.svg" />
      }
    }
  },
  iconRight: {
    control: {
      type: 'select',
      options: {
        noIcon: '',
        withIcon: <img src="/images/vote/authenticate-icon.svg" />
      }
    }
  },
  onClick: {
    control: {
      disabled: true
    }
  },
}
Playground.args = PlaygroundArgs
Playground.argTypes = ArgTypes
Primary.args = PrimaryArgs
Primary.argTypes = ArgTypes
Outlined.args = OutlinedArgs
Outlined.argTypes = ArgTypes
White.args = WhiteArgs
White.argTypes = ArgTypes
Outlined.args = OutlinedArgs
Outlined.argTypes = ArgTypes
Light.args = LightArgs
Light.argTypes = ArgTypes

