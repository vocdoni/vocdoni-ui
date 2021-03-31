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
        <Column span={12}>Column span 12/12</Column>

        <Column span={8}>Column span 8/12</Column>
        <Column span={4}>Column span 4/12</Column>

        <Column span={6}>Column span 6/12</Column>
        <Column span={6}>Column span 6/12</Column>

        <Column span={4}>Column span 4/12</Column>
        <Column span={4}>Column span 4/12</Column>
        <Column span={4}>Column span 4/12</Column>

        <Column span={3}>Column span 3/12</Column>
        <Column span={3}>Column span 3/12</Column>
        <Column span={6}>Column span 6/12</Column>

        <Column span={2} tabletSpan={3} mobileSpan={4}>C 2/12</Column>
        <Column span={2} tabletSpan={3} mobileSpan={4}>C 2/12</Column>
        <Column span={2} tabletSpan={3} mobileSpan={4}>C 2/12</Column>
        <Column span={2} tabletSpan={3} mobileSpan={4}>C 2/12</Column>
        <Column span={2} tabletSpan={3} mobileSpan={4}>C 2/12</Column>
        <Column span={2} tabletSpan={3} mobileSpan={4}>C 2/12</Column>

        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
        <Column span={1} tabletSpan={4} mobileSpan={6}>C 1/12</Column>
      </Grid>

      <h2>With Cards</h2>
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

        <Card span={2} tabletSpan={3} mobileSpan={4}>CC 2/12</Card>
        <Card span={2} tabletSpan={3} mobileSpan={4}>CC 2/12</Card>
        <Card span={2} tabletSpan={3} mobileSpan={4}>CC 2/12</Card>
        <Card span={2} tabletSpan={3} mobileSpan={4}>CC 2/12</Card>
        <Card span={2} tabletSpan={3} mobileSpan={4}>CC 2/12</Card>
        <Card span={2} tabletSpan={3} mobileSpan={4}>CC 2/12</Card>

        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
        <Card span={1} tabletSpan={4} mobileSpan={6}>CC 1/12</Card>
      </Grid>

      <h2>With CardStatus</h2>
      <Grid>
        <StatusCard span={4} title="Active votes" rightText="More here" href="/">
          <h3>1234</h3>
        </StatusCard>
        <StatusCard span={8} title="Ended votes" rightText="Right label">
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

      <h1>Hooks</h1>
      <h2>Use Wallet</h2>
      <div>
        <p>Current wallet: {wallet?.address || "-"}</p>
        {wallet ? <p>This wallet can be accessed globally</p> : null}
        <Button positive small onClick={() => setWallet(Wallet.createRandom())}>Sign in using a new wallet</Button>
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
    </div>
  )
}

const DivWithMarginChildren = styled.div`
& > * {
  margin-right: 20px;
  margin-bottom: 20px;
}
`

export default withRouter(IndexPage)
