import React, { useEffect } from 'react'
import styled from 'styled-components'
import MarkDownIt from 'markdown-it'

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

// & p {
//   margin: 0 0.4em;
// }
const MarkdownWrapper = styled.div`
  & li  {
    white-space: initial;
  }


  & blockquote {
    border-left: 1px solid #e0e0e0;
    padding-left: 20px;
    margin-left: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  & h1 {
    font-size: 20px;
    font-weight: 500;
  }

  & h2 {
    font-size: 18px;
    font-weight: 500;
  }

  & strong {
    font-weight: bold;
  }

  & ul {
    margin-top:0px;
  }

  & ol {
    margin-top: 0px;
  }

  & p {
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 16px;
    line-height: 25px;
  }

  & p + ul {
    margin-top: -14px;
  }

`
