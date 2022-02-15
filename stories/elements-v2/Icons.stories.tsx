import { Col, Row, Text } from "@components/elements-v2"
import { AvailableIcons, Icon } from "@components/elements-v2/icons"
import { ComponentStory } from "@storybook/react"
import { theme } from "@theme/global"

export default {
  title: 'Elements V2/Icons',
  component: Icon,
}
const Template: ComponentStory<typeof Icon> = (args) => (
  <Row gutter="xl">
    <Col>
      <Icon {...args} name='alert-circle' />
    </Col>
  </Row>
)
export const Playground = Template.bind({})
const availableIcons: AvailableIcons[] = [
  'chevron-right',
  'pie-chart',
  'download',
  'trash',
  'shutdown',
  'pencil',
  'lightning-slash',
  'chevron-up-down',
  'eye',
  'alert-circle',
  'spinner',
  'cog',
  'calendar',
  'paper-check']
export const Showcase = (args) => (
  <>
    <Row gutter="lg">
      {availableIcons.map((icon, index) => (
        <Col key={index}>
          <Row align="center">
            <Col>
              <Icon name={icon} />
            </Col>
            <Col>
              <Text size='sm' color="dark-blue">
                {icon}
              </Text>
            </Col>
          </Row>
        </Col>
      ))
      }
    </Row>
  </>
)

const PlaygroundArgs = {
  name: 'alert-circle',
  size: 32,
  color: theme.accent1
}
Playground.args = PlaygroundArgs

