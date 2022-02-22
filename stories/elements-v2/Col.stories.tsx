import React from "react";

import { Row, Col, Card, Text } from "@components/elements-v2";
export default {
  title: 'Elements V2/Grid/Col',
  component: Col,
}
const iter = Array.from(Array(10).keys())
export const Playground = (args) => (
  <Row>
    {iter.map(index =>
      <Col {...args}>
        <Card height={index % 2 ? "250px" : ''}>
          <Text color="dark-blue" weight="semi-bold">
            This is column &nbsp;
          </Text>
          <Text color="dark-blue" weight="semi-bold">
            {index}
          </Text>
        </Card>
      </Col>
    )}
  </Row>

)

Playground.args = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 2,
  xl: 2,
}
Playground.argTypes = {
  xs: { control: { type: 'number' } },
  sm: { control: { type: 'number' } },
  md: { control: { type: 'number' } },
  lg: { control: { type: 'number' } },
  xl: { control: { type: 'number' } },
  ref: { control: { disable: true } },
  theme: { table: { disable: true } },
  as: { table: { disable: true } },
  forwardedAs: { table: { disable: true } },
}


