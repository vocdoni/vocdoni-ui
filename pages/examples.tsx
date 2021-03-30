import React from 'react'
// import Link from 'next/link'
import { withRouter } from 'next/router'

import styled from "styled-components"
import Button from '../components/button'
import { useIsMobile } from '../hooks/use-window-size'
import { Grid } from '../components/grid'
import { Card, StatusCard } from '../components/cards'

// MAIN COMPONENT
const IndexPage = () => {
  const isMobile = useIsMobile()

  return (
    <div>
      <h1>Buttons</h1>
      <Centered>
        <Button>Default button</Button>
        <Button wide>Wide button</Button>
        <Button icon={<span>(icon)</span>}>Button title</Button>
      </Centered>
      <Centered>
        <Button>Default button</Button>
        <Button positive>Positive button</Button>
        <Button negative>Negative button</Button>
        <Button disabled>Disabled button</Button>
      </Centered>
      <Centered>
        <Button positive large>Large button</Button>
        <Button positive>Normal button</Button>
        <Button positive small>Small button</Button>
      </Centered>
      <Centered>
        <Button onClick={() => alert("Clicked")}>Click me</Button>
        <Button href="/dashboard">Link to Dashboard</Button>
      </Centered>
      <Centered>
        <Button>Default button</Button>
        <Button color="accent1">Accent 1 button</Button>
        <Button color="accent2">Accent 2 button</Button>
        <Button color="purple">Custom color button</Button>
      </Centered>
      <Centered>
        <Button>Default width</Button>
        <Button width={300}>300px button</Button>
      </Centered>

      <h1>Grid</h1>
      <p>A Grid can contain <code>Colum</code>, <code>Card</code> and <code>CardStatus</code></p>
      <Grid>
        <Card>Card+Column 12/12</Card>
        <Card span={12}>Card+Column span 12/12</Card>

        <Card span={8}>Card+Column span 8/12</Card>
        <Card span={4}>Card+Column span 4/12</Card>

        <Card span={6}>Card+Column span 6/12</Card>
        <Card span={6}>Card+Column span 6/12</Card>

        <Card span={4}>Card+Column span 4/12</Card>
        <Card span={4}>Card+Column span 4/12</Card>
        <Card span={4}>Card+Column span 4/12</Card>

        <Card span={3}>Card+Column span 3/12</Card>
        <Card span={3}>Card+Column span 3/12</Card>
        <Card span={6}>Card+Column span 6/12</Card>

        <Card span={2}>CC 2/12</Card>
        <Card span={2}>CC 2/12</Card>
        <Card span={2}>CC 2/12</Card>
        <Card span={2}>CC 2/12</Card>
        <Card span={2}>CC 2/12</Card>
        <Card span={2}>CC 2/12</Card>

        <Card span={1}>CC 1/12</Card>
        <Card span={1}>CC 1/12</Card>
        <Card span={1}>CC 1/12</Card>
        <Card span={1}>CC 1/12</Card>
        <Card span={1}>CC 1/12</Card>
        <Card span={1}>CC 1/12</Card>
        <Card span={1}>CC 1/12</Card>
        <Card span={1}>CC 1/12</Card>
        <Card span={1}>CC 1/12</Card>
        <Card span={1}>CC 1/12</Card>
        <Card span={1}>CC 1/12</Card>
        <Card span={1}>CC 1/12</Card>
      </Grid>

      <h1>Card Grid</h1>
      <Grid>
        <StatusCard span={4} title="Active votes" rightText="More here" href="/">
          <h3>1234</h3>
        </StatusCard>
        <StatusCard span={8} title="Ended votes" rightText="More here">
          <h3>1234</h3>
        </StatusCard>

        <StatusCard span={3} title="Random votes" rightText="More here" href="/">
          <h3>2345</h3>
        </StatusCard>
        <StatusCard span={3} title="Random votes" rightText="More here" href="/">
          <h3>2345</h3>
        </StatusCard>
        <StatusCard span={3} title="Random votes" rightText="More here" href="/">
          <h3>2345</h3>
        </StatusCard>
        <StatusCard span={3} title="Random votes" rightText="More here" href="/">
          <h3>2345</h3>
        </StatusCard>
      </Grid>
    </div>
  )
}

const Centered = styled.div`
& > * {
  margin-right: 20px;
}
`

export default withRouter(IndexPage)
