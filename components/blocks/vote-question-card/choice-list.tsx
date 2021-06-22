import React from "react"
import styled from 'styled-components'

import { SectionText } from "@components/elements/text"
import { Choice, Question } from "@lib/types"


interface IChoiceSelectorProps {
  question: Question
}

export const ChoiceList = ({
  question
}: IChoiceSelectorProps) => {
  return (
    <>
      {question.choices.map((choice: Choice, index: number) => (
        <OptionContainer key={index}>
          <SectionText>{choice.title.default}</SectionText>
        </OptionContainer>
      ))}
    </>
  )
}

const OptionContainer = styled.div`
  margin: 10px 0;
`
