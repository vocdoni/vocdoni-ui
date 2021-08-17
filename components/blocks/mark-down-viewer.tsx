import React from 'react'
import styled  from 'styled-components'
import MarkDownIt from 'markdown-it'

export const MarkDownViewer = ({ content }) => {
  const md = new MarkDownIt()
  const html = md.render(content || '')
  
  return (<MarkdownWrapper dangerouslySetInnerHTML={{__html: html }}></MarkdownWrapper>)
}

const MarkdownWrapper = styled.div`
  li  {
    white-space: initial;
  }

  & p {
    margin: 0 0.4em;
  }
`