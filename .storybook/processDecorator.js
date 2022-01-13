// themeDecorator.js
import React from 'react'
import { UseProcessProvider, useProcess } from '@vocdoni/react-hooks'

const processDecorator = (storyFn) => {
  return <UseProcessProvider>{storyFn()}</UseProcessProvider>
}

export default processDecorator
