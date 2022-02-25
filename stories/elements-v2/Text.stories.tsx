import React, { Children } from "react";

import { Row, Col, Card, Text, Button, Spacer, TextSize, TextWeight, TextColor } from "@components/elements-v2";
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
const sizes: TextSize[] = ['display-1', '2xl', 'xl', 'lg', 'md', 'sm', 'xs', '2xs']
const sizesInPx = ['32px', '24px', '22px', '20px', '18px', '16px', '14px', '12px']
const weights: TextWeight[] = ['light', 'regular', 'medium', 'bold']
const colors: TextColor[] = ['primary', 'dark-blue', 'dark-gray', 'white', 'error', 'secondary']
export const Showcase = (args) => (
  <>
    <Row>
      {/* SIZES */}
      <Col xs={4}>
        <Row>
          <Col xs={12}>
            <Text size="2xl" weight="bold">
              SIZES
            </Text>
          </Col>
          <Col xs={12}>
            <Spacer showDivider direction="horizontal" size="md" />
          </Col>
          {sizes.map((size, index) => (
            <Col xs={12} key={index}>
              <Text size={size}>
                {size} · {sizesInPx[index]}
              </Text>
            </Col>
          ))
          }
        </Row>
      </Col>
      {/* WEIGHTS */}
      <Col xs={4}>
        <Row>
          <Col xs={12}>
            <Text size="2xl" weight="bold">
              WEIGHTS
            </Text>
          </Col>
          <Col xs={12}>
            <Spacer showDivider direction="horizontal" size="md" />
          </Col>
          {weights.map((weight, index) => (
            <Col xs={12} key={index}>
              <Text weight={weight}>
                {weight}
              </Text>
            </Col>
          ))
          }
        </Row>
      </Col>
      {/* WEIGHTS */}
      <Col xs={4}>
        <Row>
          <Col xs={12}>
            <Text size="2xl" weight="bold">
              COLORS
            </Text>
          </Col>
          <Col xs={12}>
            <Spacer showDivider direction="horizontal" size="md" />
          </Col>
          {colors.map((color, index) => (
            <Col xs={12} key={index}>
              <Text color={color}>
                {color}
              </Text>
            </Col>
          ))
          }
        </Row>
      </Col>
    </Row>
  </>
)

const PlaygroundArgs = {
  children: 'Text',
  size: 'md',
  weight: 'bold',
  color: 'dark-blue'
}
Playground.args = PlaygroundArgs

