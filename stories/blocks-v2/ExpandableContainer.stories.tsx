import React, { Children, useState } from "react";

import { Row, Col } from "@components/elements-v2";
import { ComponentStory } from "@storybook/react";
import { ExpandableCard } from "@components/blocks/expandable-card";
import { Text } from "@components/elements-v2";
export default {
  title: 'Blocks V2/ExpandableCard',
  component: ExpandableCard,
}
const Template: ComponentStory<typeof ExpandableCard> = (args) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Row gutter="xl">
      <Col xs={12} >
        <ExpandableCard {...args}
          isOpen={isOpen}
          onButtonClick={() => setIsOpen(!isOpen)}
        >
          <Text size="md" color="dark-blue">{text}</Text>
        </ExpandableCard>
      </Col>
    </Row>
  )
}

export const Playground = Template.bind({})

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et hendrerit sem, sit amet eleifend neque. Morbi a porta ante, ac dapibus quam. Fusce a lectus ultrices, pretium arcu a, tempus ante. Integer sit amet pharetra nisl, eget consequat risus. Cras vel purus sed libero mattis pellentesque eget eu quam. Donec pharetra ante vel dui tempus imperdiet. Mauris id pellentesque dui, vel elementum nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis laoreet molestie est at dapibus. Maecenas pharetra lectus arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum sed magna ac ipsum vulputate pharetra. Fusce eu orci finibus, tempor est sed, laoreet orci. Phasellus non libero ut nunc tincidunt dapibus sit amet nec odio. Vivamus magna neque, iaculis ac pretium nec, interdum vitae sem. Etiam sit amet viverra enim. Ut posuere mi arcu, at pharetra leo mollis pellentesque. Nulla eget ornare ipsum. Curabitur placerat lectus facilisis, semper ante vitae, faucibus ex. Aenean id vestibulum sapien, quis sollicitudin ante. Sed sed nulla eros. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.`
const playgroundArgs = {
  title: 'Vote Results',
  icon: <img src="/images/vote/vote-results.svg" />,
  buttonProps: {
    variant: 'light',
    children: 'show',
  },
  buttonPropsOpen:{
    variant: 'light',
    children: 'hide',
  }
}
const playgroundArgTypes = {
  icon: {
    control: {
      type: 'select',
      options: {
        noIcon: '',
        withIcon: <img src="/images/vote/vote-results.svg" />
      }
    }
  },
  buttonProps: {
    control: {
      type: 'select',
      options: {
        button1: {
          variant: 'light',
          children: 'show',
        },
        button2: {
          variant: 'primary',
          children: 'show'
        }
      }
    }
  },
  buttonPropsOpen: {
    control: {
      type: 'select',
      options: {
        button1: {
          variant: 'light',
          children: 'hide'
        },
        button2: {
          variant: 'primary',
          children: 'hide'
        }
      }
    }
  },
}
Playground.argTypes = playgroundArgTypes
Playground.args = playgroundArgs
