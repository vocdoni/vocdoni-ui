import React from "react";

import { Row, Col } from "@components/elements-v2";
import { CalendarCard } from "@components/pages/pub/votes/components/calendar-card";
import { ComponentStory } from "@storybook/react";
export default {
  title: 'Blocks V2/CalendarCard',
  component: CalendarCard,
}
const Template: ComponentStory<typeof CalendarCard> = (args) => {
  return (
    <Row gutter="xl">
      <Col xs={12} md={4} >
        <CalendarCard {...args} {...showcaseArgs} />
      </Col>
    </Row>
  )
}

export const Showcase = Template.bind({})

const showcaseArgs = {
  startDate: new Date(),
  endDate: new Date()
}
