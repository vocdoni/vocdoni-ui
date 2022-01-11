import React from "react";

import { Row, Col, Card, Text } from "@components/elements-v2";
import { ComponentStory } from "@storybook/react";

export default {
  title: 'Elements V2/Grid/Row',
  component: Row,
  subComponents: { Col }
}

export const Playground = (args) => (
    <Row {...args}>
      <Col xs={8} md={3} >
        <Card>
          <Text color="dark-blue" weight="bold">
            xs-8   /   md-3
          </Text>
        </Card>
      </Col>
      <Col xs={4} md={6}>
        <Card>
          <Text color="dark-blue" weight="bold">
            xs-4   /   md-6
          </Text>
        </Card>
      </Col>
      <Col xs={6} md={5}>
        <Card>
          <Text color="dark-blue" weight="bold">
            xs-5   /   md-5
          </Text>
        </Card>
      </Col>
      <Col xs={6} md={4}>
        <Card>
          <Text color="dark-blue" weight="bold">
            xs-6   /   md-4
          </Text>
        </Card>
      </Col>

      <Col xs={5} md={5}>
        <Card>
          <Text color="dark-blue" weight="bold">
            xs-5   /   md-5
          </Text>
        </Card>
      </Col>
      <Col xs={3} md={5}>
        <Card>
          <Text color="dark-blue" weight="bold">
            xs-3   /   md-5
          </Text>
        </Card>
      </Col>
      <Col xs={4} md={2}>
        <Card>
          <Text color="dark-blue" weight="bold">
            xs-4   /   md-2
            <br/>
            This column has more heigth so align can be tested
          </Text>
        </Card>
      </Col>
    </Row>
)
Playground.argTypes = {
  ref: { control: { disable: true } },
  theme: { table: { disable: true } },
  as: { table: { disable: true } },
  forwardedAs: { table: { disable: true } },
}
