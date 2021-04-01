import React from 'react'
// import Link from 'next/link'
import { withRouter } from 'next/router'

import styled from "styled-components"
import Button from '../components/button'
import { Column, Grid } from '../components/grid'
import { Card, StatusCard } from '../components/cards'
import { useWallet } from '../hooks/use-wallet'
import { Wallet } from 'ethers'
import { useDbAccounts } from '../hooks/use-db-accounts'
import { Symmetric } from 'dvote-js'
import { Buffer } from "buffer/"
import { Steps } from '../components/steps'

// MAIN COMPONENT
const IndexPage = () => {
  const { wallet, setWallet, setWalletFromEntity } = useWallet()
  const { accounts, addAccount, error, refreshAccounts } = useDbAccounts()

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
        <Button href="/dashboard">Link to Dashboard</Button>
      </DivWithMarginChildren>
      <DivWithMarginChildren>
        <Button>Default button</Button>
        <Button color="accent1">Accent 1 button</Button>
        <Button color="accent2">Accent 2 button</Button>
        <Button color="purple">Custom color button</Button>
      </DivWithMarginChildren>
      <DivWithMarginChildren>
        <Button>Default width</Button>
        <Button width={300}>300px button</Button>
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

      <h1>Hooks</h1>
      <h2>Use Wallet</h2>
      <div>
        <p>Current wallet: {wallet?.address || "-"}</p>
        {wallet ? <p>This wallet can be accessed globally</p> : null}
        <Button positive small onClick={() => setWallet(Wallet.createRandom())}>Sign in using a new wallet</Button>
        &nbsp;&nbsp;
        <Button positive small onClick={() => setWalletFromEntity(dummyEncrypt("hello"), "hello")}>Simulate login</Button>
        &nbsp;&nbsp;
        <Button negative small disabled={!wallet} onClick={() => setWallet(null)}>Sign out</Button>
      </div>

      <h2>Use DB Accounts</h2>
      <div>
        <p>Current accounts:</p>
        <ul>
          {accounts.map(account => <li key={account.address}>{account.name}</li>)}
        </ul>
        <Button small onClick={() => refreshAccounts()}>Refresh accounts (unneeded)</Button>
        &nbsp;&nbsp;
        <Button positive small onClick={() => addAccount({ name: "Account " + Math.random(), address: "0xaddr-" + Math.random(), encryptedPrivateKey: "abcde" + Math.random() })}>Add account</Button>
      </div>

      <h2>Steps</h2>
      <div>
        <Steps steps={["Step 1", "Step 2", "Step 3", "Step 4"]} activeIdx={2} />
      </div>
    </div>
  )
}

const DivWithMarginChildren = styled.div`
& > * {
  margin-right: 20px;
  margin-bottom: 20px;
}
`

const dummyEncrypt = (passphrase: string): string => {
  const w = Wallet.createRandom()
  const privKeyBytes = Buffer.from(w.privateKey.slice(2), "hex")
  return Symmetric.encryptBytes(privKeyBytes, passphrase)
}

export default withRouter(IndexPage)
