import React from 'react'
import { Row, Card, Col, Text, CardProps, Button } from '@components/elements-v2'
import styled from 'styled-components'
import { theme } from '@theme/global'
import { colorsV2 } from '@theme/colors-v2'
import { FormGroupVariant, InputFormGroup } from '@components/blocks/form'

interface StoreCensusButtonProps {
    onClick?: (e: any) => void
    options: Option[]
    value: any
}

type Option = {
    title: string
    subtitle?: string
    value: any
}
interface StyledCardProps extends CardProps {
    active: boolean
}


export const StoreCensusButton = (props: StoreCensusButtonProps) => {
    return (
        <Card variant='gray' padding='0'>
            <Col xs={12}>
                <Row gutter='none'>
                    <Text
                        align='center'
                        size='sm'
                        weight='bold'
                    >
                        {"Save this census list"}
                    </Text>
                </Row>
                <Row>
                    <Col xs={4}>
                        <InputFormGroup
                            onChange={() => { }}
                            placeholder='Census name'
                            variant={FormGroupVariant.Regular}
                        />
                    </Col>

                    <Col xs={2}>
                        <Button onClick={() => { }}>Save</Button>
                    </Col>

                </Row>
            </Col>
        </Card>
    )
}
const getBorderColor = (props: StyledCardProps) => {
    if (props.active) {
        return theme.accent1
    }
    return 'transparent'
}
const getShadow = (props: StyledCardProps) => {
    if (props.active) {
        return '0px 6px 25px rgba(65, 70, 85, 0.05)'
    }
    return ''
}
const getBackgroundColor = (props: StyledCardProps) => {
    if (props.active) {
        return colorsV2.neutral[0]
    }
    return colorsV2.neutral[50]
}

const StyledCard = styled(Card) <StyledCardProps>`
  box-shadow: ${getShadow};
  box-sizing: border-box;
  cursor:pointer;
  border-color: ${getBorderColor};
  background-color: ${getBackgroundColor};
`
