import React, { Component } from 'react'

import { UseAccountContext } from '../../hooks/account'
import { StepProps } from '../../lib/types'

export default class EntityCreation extends Component<StepProps, undefined> {
  static contextType = UseAccountContext
  context !: React.ContextType<typeof UseAccountContext>

  componentDidMount() {

  }

  render() {
    return <div>Wait, creating account</div>
  }
}
