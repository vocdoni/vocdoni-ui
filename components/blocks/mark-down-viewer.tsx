import React, { useEffect } from 'react'
import styled from 'styled-components'
import MarkDownIt from 'markdown-it'
import { wrap } from 'module'

export const MarkDownViewer = ({ content }) => {
  const wrapperRef = React.useRef(null)
  const md = new MarkDownIt()
  const html = md.render(content || '')

  const handleClickEvent = (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault()
      window.open(event.target.href, '_blank')
    }
  }

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current?.addEventListener('click', handleClickEvent)
      return () => wrapperRef.current?.removeEventListener('click', handleClickEvent)
    }
  }, [])

  return (<MarkdownWrapper dangerouslySetInnerHTML={{ __html: html }} ref={wrapperRef}></MarkdownWrapper>)
}

const MarkdownWrapper = styled.div`
  & li  {
    white-space: initial;
  }

  & p {
    margin: 0 0.4em;
  }

  & blockquote {
    border-left: 1px solid #e0e0e0;
    padding-left: 20px;
    margin-left: 0px;
  }

  & h1,
  & h2 {
    font-weight: 500;
  }

  & h1 {
    font-size: 28px;
  }

  & h2 {
    font-size: 20px;
  }
`