import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
// import Link from 'next/link'
import { withRouter } from 'next/router'

import styled from "styled-components"
import { Button, SquareButton, ButtonColor } from '../components/elements/button'
import { Column, Grid } from '../components/elements/grid'
import { Card, PageCard, StatusCard } from '../components/elements/cards'
import { useWallet } from '../hooks/use-wallet'
import { Wallet } from 'ethers'
import { useDbAccounts } from '../hooks/use-db-accounts'
import { Symmetric } from 'dvote-js'
import { Buffer } from "buffer/"
import { Steps } from '../components/blocks/steps'
import { Input, Select, Textarea } from '../components/elements/inputs'
import { Radio } from '../components/elements/radio'
import { colors } from '../theme/colors'
import { Banner } from '../components/blocks/banners'
import { VoteListItem } from '../components/blocks/list-items'
import { VoteStatus } from "@lib/util"
import { DASHBOARD_PATH } from '../const/routes'

// MAIN COMPONENT
const IndexPage = () => {
  const { wallet, setWallet, restoreEncryptedWallet } = useWallet()
  const { dbAccounts, addDbAccount, error, refreshAccounts } = useDbAccounts()
  const [myVal, setMyVal] = useState("-")

  return (
    <div>
      <h1>Buttons</h1>
      <DivWithMarginChildren>
        <Button>Default button</Button>
        <Button wide>Wide button</Button>
        <Button icon={<span>(icon)</span>}>Button title</Button>
      </DivWithMarginChildren>
      <DivWithMarginChildren>
        <Button>Default button</Button>
        <Button border>Default with border</Button>
        <Button positive>Positive button</Button>
        <Button negative>Negative button</Button>
        <Button disabled>Disabled button</Button>
      </DivWithMarginChildren>
      <DivWithMarginChildren>
        <Button positive large>Large button</Button>
        <Button positive>Normal button</Button>
        <Button positive small>Small button</Button>
      </DivWithMarginChildren>
      <DivWithMarginChildren>
        <Button onClick={() => alert("Clicked")}>Click me</Button>
        <Button href={DASHBOARD_PATH}>Link to Dashboard</Button>
      </DivWithMarginChildren>
      <DivWithMarginChildren>
        <Button>Default button</Button>
        <Button color={ButtonColor.Positive}>Positive button</Button>
        <Button color={ButtonColor.Negative}>Negative button</Button>
        <Button color="purple">Custom color button</Button>
      </DivWithMarginChildren>
      <DivWithMarginChildren>
        <Button>Default width</Button>
        <Button width={300}>300px button</Button>
      </DivWithMarginChildren>
      <DivWithMarginChildren>
        <SquareButton
          icon={<div style={{ textAlign: 'center' }}>(LOGO)</div>}
        >
          <p>Square button</p>
        </SquareButton>
      </DivWithMarginChildren>

      <h1>Grid</h1>
      <p>A Grid can contain <code>Colum</code>, <code>Card</code> and <code>CardStatus</code></p>

      <h2>With Columns</h2>
      <Grid>
        <Column>Column 12/12</Column>
        <Column lg={12}>Column span 12/12</Column>

        <Column lg={8}>Column span 8/12</Column>
        <Column lg={4}>Column span 4/12</Column>

        <Column lg={6}>Column span 6/12</Column>
        <Column lg={6}>Column span 6/12</Column>

        <Column lg={4}>Column span 4/12</Column>
        <Column lg={4}>Column span 4/12</Column>
        <Column lg={4}>Column span 4/12</Column>

        <Column lg={3}>Column span 3/12</Column>
        <Column lg={3}>Column span 3/12</Column>
        <Column lg={6}>Column span 6/12</Column>

        <Column lg={2} md={3} span={4}>C 2/12</Column>
        <Column lg={2} md={3} span={4}>C 2/12</Column>
        <Column lg={2} md={3} span={4}>C 2/12</Column>
        <Column lg={2} md={3} span={4}>C 2/12</Column>
        <Column lg={2} md={3} span={4}>C 2/12</Column>
        <Column lg={2} md={3} span={4}>C 2/12</Column>

        <Column lg={1} md={4} span={6}>C 1/12</Column>
        <Column lg={1} md={4} span={6}>C 1/12</Column>
        <Column lg={1} md={4} span={6}>C 1/12</Column>
        <Column lg={1} md={4} span={6}>C 1/12</Column>
        <Column lg={1} md={4} span={6}>C 1/12</Column>
        <Column lg={1} md={4} span={6}>C 1/12</Column>
        <Column lg={1} md={4} span={6}>C 1/12</Column>
        <Column lg={1} md={4} span={6}>C 1/12</Column>
        <Column lg={1} md={4} span={6}>C 1/12</Column>
        <Column lg={1} md={4} span={6}>C 1/12</Column>
        <Column lg={1} md={4} span={6}>C 1/12</Column>
        <Column lg={1} md={4} span={6}>C 1/12</Column>
      </Grid>

      <h2>With Cards</h2>
      <Grid>
        <Card>Card+Column 12/12</Card>
        <Card lg={12}>Card+Column span 12/12</Card>

        <Card lg={8}>Card+Column span 8/12</Card>
        <Card lg={4}>Card+Column span 4/12</Card>

        <Card lg={6}>Card+Column span 6/12</Card>
        <Card lg={6}>Card+Column span 6/12</Card>

        <Card lg={4}>Card+Column span 4/12</Card>
        <Card lg={4}>Card+Column span 4/12</Card>
        <Card lg={4}>Card+Column span 4/12</Card>

        <Card lg={3}>Card+Column span 3/12</Card>
        <Card lg={3}>Card+Column span 3/12</Card>
        <Card lg={6}>Card+Column span 6/12</Card>

        <Card lg={2} md={3} span={4}>CC 2/12</Card>
        <Card lg={2} md={3} span={4}>CC 2/12</Card>
        <Card lg={2} md={3} span={4}>CC 2/12</Card>
        <Card lg={2} md={3} span={4}>CC 2/12</Card>
        <Card lg={2} md={3} span={4}>CC 2/12</Card>
        <Card lg={2} md={3} span={4}>CC 2/12</Card>

        <Card lg={1} md={4} span={6}>CC 1/12</Card>
        <Card lg={1} md={4} span={6}>CC 1/12</Card>
        <Card lg={1} md={4} span={6}>CC 1/12</Card>
        <Card lg={1} md={4} span={6}>CC 1/12</Card>
        <Card lg={1} md={4} span={6}>CC 1/12</Card>
        <Card lg={1} md={4} span={6}>CC 1/12</Card>
        <Card lg={1} md={4} span={6}>CC 1/12</Card>
        <Card lg={1} md={4} span={6}>CC 1/12</Card>
        <Card lg={1} md={4} span={6}>CC 1/12</Card>
        <Card lg={1} md={4} span={6}>CC 1/12</Card>
        <Card lg={1} md={4} span={6}>CC 1/12</Card>
        <Card lg={1} md={4} span={6}>CC 1/12</Card>
      </Grid>

      <h2>With CardStatus</h2>
      <Grid>
        <StatusCard md={4} title="Active votes" rightText="More here" href="/">
          <h3>1234</h3>
        </StatusCard>
        <StatusCard md={8} title="Ended votes" rightText="Right label">
          <h3>1234</h3>
        </StatusCard>

        <StatusCard lg={3} md={6} title="Random votes" rightText="More here" href="/">
          <h3>2345</h3>
        </StatusCard>
        <StatusCard lg={3} md={6} title="Random votes" rightText="More here" href="/">
          <h3>2345</h3>
        </StatusCard>
        <StatusCard lg={3} md={6} title="Random votes" rightText="More here" href="/">
          <h3>2345</h3>
        </StatusCard>
        <StatusCard lg={3} md={6} title="Random votes" rightText="More here" href="/">
          <h3>2345</h3>
        </StatusCard>
      </Grid>

      <h2>With Banner</h2>
      <Grid>
        <Banner title="Default banner" subtitle="Banner subtitle here" rightButton={<Button positive width={180}>Click me</Button>} icon={<span>(icon)</span>} />
        <Banner warning title="Warning banner" subtitle="Banner subtitle here" rightButton={<Button negative width={180}>Click me</Button>} icon={<span>(icon)</span>} />
        <Banner title="Container banner" subtitle="Banner subtitle here" rightButton={<Button positive width={180}>Click me</Button>} icon={<span>(icon)</span>}>
          <Grid>
            <Card md={4}>Nested</Card>
            <Card md={4}>Content</Card>
            <Card md={4}>Here</Card>
          </Grid>
        </Banner>
      </Grid>

      <h1>VoteListItem</h1>
      <VoteListItem
        icon={<span>(logo)</span>}
        entityName="My Entity"
        link=""
        title="Vote title here"
        description="Description of the process goes here"
        status={VoteStatus.Active}
        dateText="1 day left"
      />

      <h1>PageCard</h1>
      <PageCard>
        <h3>Content goes here</h3>
        <p>Some more text goes here</p>
      </PageCard>

      <h1>Hooks</h1>
      <h2>Use Wallet</h2>
      <div>
        <p>Current wallet: {wallet?.address || "-"}</p>
        {wallet ? <p>This wallet can be accessed globally</p> : null}
        <Button positive small onClick={() => setWallet(Wallet.createRandom())}>Sign in using a new wallet</Button>
        &nbsp;&nbsp;
        <Button positive small onClick={() => restoreEncryptedWallet(dummyEncrypt("hello"), null, "hello")}>Simulate login</Button>
        &nbsp;&nbsp;
        <Button negative small disabled={!wallet} onClick={() => setWallet(null)}>Sign out</Button>
      </div>

      <h2>Use DB Accounts</h2>
      <div>
        <p>Current accounts:</p>
        <ul>
          {dbAccounts.map(account => <li key={account.address}>{account.name}</li>)}
        </ul>
        <Button small onClick={() => refreshAccounts()}>Refresh accounts (unneeded)</Button>
        &nbsp;&nbsp;
        <Button positive small onClick={() => addDbAccount({ name: "Account " + Math.random(), address: "0xaddr-" + Math.random(), encryptedMnemonic: "abcde" + Math.random() })}>Add account</Button>
      </div>

      <h1>Steps</h1>
      <div>
        <Steps steps={["Step 1", "Step 2", "Step 3", "Step 4"]} activeIdx={0} showProgress={true} />
        <Steps steps={["Step 1", "Step 2", "Step 3", "Step 4"]} activeIdx={1} showProgress={true} />
        <Steps steps={["Step 1", "Step 2", "Step 3", "Step 4"]} activeIdx={2} showProgress={true} />
        <Steps steps={["Step 1", "Step 2", "Step 3", "Step 4"]} activeIdx={3} showProgress={true} />
      </div>

      <h1>Input fields</h1>
      <h2>Input text</h2>
      <div>
        <Input placeholder="Placeholder here" />
        <br />
        <Input wide placeholder="Wide input form" />
      </div>
      <h2>Text area</h2>
      <div>
        <Textarea placeholder="Default textarea" />
        <br />
        <Textarea wide placeholder="Wide textarea" />
      </div>

      <h2>Select</h2>
      <div>
        <Select options={[
          {
            value: 'First option',
            label: 'first_option'
          }, {
            value: 'Second option',
            label: 'Second_option'
          }
        ]} />
      </div>

      <h2>Radio</h2>
      <div>
        <Radio name="my-question-1" onClick={() => setMyVal("Option A")}>Option A</Radio>
        <Radio name="my-question-1" onClick={() => setMyVal("Option B")}>Option B</Radio>
        <Radio name="my-question-1" onClick={() => setMyVal("Option C")}>Option C</Radio>
        <p>Current selection: {myVal}</p>
      </div>
      <h2>Colors</h2>
      <div>
        <p style={{ color: colors.text }}>This color is <code>text</code></p>
        <p style={{ color: colors.lightText }}>This color is <code>lightText</code></p>
        <p style={{ color: colors.lighterText }}>This color is <code>lighterText</code></p>
        <p style={{ color: colors.textAccent1 }}>This color is <code>textAccent1</code></p>
        <p style={{ color: colors.textAccent1B }}>This color is <code>textAccent1B</code></p>
        <p style={{ color: colors.textAccent1C }}>This color is <code>textAccent1C</code></p>
        <p style={{ color: colors.textAccent1Grayed }}>This color is <code>textAccent1Grayed</code></p>
        <p style={{ color: colors.textAccent2 }}>This color is <code>textAccent2</code></p>
        <p style={{ color: colors.textAccent2B }}>This color is <code>textAccent2B</code></p>
        <BgDiv style={{ background: colors.accent1 }}>This color is <code>accent1</code></BgDiv>
        <BgDiv style={{ background: colors.accent1B }}>This color is <code>accent1B</code></BgDiv>
        <BgDiv style={{ background: colors.accent1C }}>This color is <code>accent1C</code></BgDiv>
        <BgDiv style={{ background: colors.accent2 }}>This color is <code>accent2</code></BgDiv>
        <BgDiv style={{ background: colors.accent2B }}>This color is <code>accent2B</code></BgDiv>
        <BgDiv style={{ background: colors.accentLight1 }}>This color is <code>accentLight1</code></BgDiv>
        <BgDiv style={{ background: colors.accentLight1B }}>This color is <code>accentLight1B</code></BgDiv>
        <BgDiv style={{ background: colors.accentLight2 }}>This color is <code>accentLight2</code></BgDiv>
        <BgDiv style={{ background: colors.accentLight2B }}>This color is <code>accentLight2B</code></BgDiv>
        <BgDiv style={{ background: colors.white }}>This color is <code>white</code></BgDiv>
        <BgDiv style={{ background: colors.darkFg }}>This color is <code>darkFg</code></BgDiv>
        <BgDiv style={{ background: colors.darkMidFg }}>This color is <code>darkMidFg</code></BgDiv>
        <BgDiv style={{ background: colors.darkLightFg }}>This color is <code>darkLightFg</code></BgDiv>
        <BgDiv style={{ background: colors.lightBg }}>This color is <code>lightBg</code></BgDiv>
        <BgDiv style={{ background: colors.lightBg2 }}>This color is <code>lightBg2</code></BgDiv>
        <BgDiv style={{ border: "3px solid " + colors.lightBorder }}>This border is <code>lightBorder</code></BgDiv>
      </div>
    </div >
  )
}

const DivWithMarginChildren = styled.div`
& > * {
  margin-right: 20px;
  margin-bottom: 20px;
}
`

const BgDiv = styled.div`
padding: 20px;
color: #777;
margin-bottom: 20px;
border-radius: 8px;
`

const dummyEncrypt = (passphrase: string): string => {
  const w = Wallet.createRandom()
  const privKeyBytes = Buffer.from(w.privateKey.slice(2), "hex")
  return Symmetric.encryptBytes(privKeyBytes, passphrase)
}

export default withRouter(IndexPage)
