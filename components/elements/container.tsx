import { sizes } from '@theme/sizes'
import styled from 'styled-components'

export const Container = styled.div`
  max-width: ${sizes.laptopL * 0.8}px;
  padding-left: ${({theme}) => theme.margins.mobile.horizontal};
  padding-right: ${({theme}) => theme.margins.mobile.horizontal};

  margin-left: auto;
  margin-right: auto;
  position: relative;
`
