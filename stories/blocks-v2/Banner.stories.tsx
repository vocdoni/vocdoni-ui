import React, { Children } from 'react'

import { Row, Col, Card, Text, Banner } from '@components/elements-v2'
import { LightningSlashIcon } from '@components/elements-v2/icons'
import { ComponentStory } from '@storybook/react'
import i18n from '@i18n'
export default {
  title: 'Blocks V2/Banner',
  component: Banner,
}
const Template: ComponentStory<typeof Banner> = (args) => (
  <Row gutter="xl">
    <Col xs={12}>
      <Banner {...args} />
    </Col>
  </Row>
)

export const Playground = Template.bind({})
export const Disconnect = Template.bind({})
export const Authenticate = Template.bind({})

Playground.args = {
  variant: 'primary',
  children: 'This is the banner title',
  titleProps: {
    size: 'md',
    weight: 'bold',
  },
  subtitleProps: {
    size: 'xs',
    weight: 'regular',
    children: 'This is the the subtitle',
  },
  image: <img src="/images/vote/authenticate-banner-image.jpg" />,
  buttonProps: {
    variant: 'primary',
    children: 'Button',
  },
}
Authenticate.args = {
  variant: 'primary',
  children: i18n.t('not_authenticated'),
  titleProps: {
    size: 'sm',
    weight: 'bold',
  },
  subtitleProps: {
    size: 'md',
    weight: 'regular',
    children: i18n.t('with_credentials'),
  },
  image: <img src="/images/vote/authenticate-banner-image.jpg" />,
  buttonProps: {
    variant: 'primary',
    children: i18n.t('auth_button'),
  },
}
Disconnect.args = {
  variant: 'white',
  children: `You are connected as: <b>aa...aa / bb...bb / c...@dddd.ee</b>`,
  titleProps: {
    size: 'sm',
    weight: 'regular',
  },
  image: <img src="/images/vote/authenticate-banner-image.jpg" />,
  buttonProps: {
    variant: 'white',
    children: 'Disconnect',
    iconRight: <LightningSlashIcon />,
  },
}

Playground.argTypes = {
  image: {
    control: {
      type: 'select',
      options: {
        noImage: '',
        withImage: <img src="/images/vote/authenticate-banner-image.jpg" />,
      },
    },
  },
  buttonProps: {
    control: {
      type: 'select',
      options: {
        'No Button': '',
        'With Button': {
          variant: 'primary',
          children: 'Button',
        },
      },
    },
  },
}
