import React from 'react'
import styled from 'styled-components'
import { Column, Grid } from '../elements/grid'

export const Skeleton = () => (
  <>
    <Grid>
      <Column md={3} sm={12}>
        <SkeletonImageContainer />
      </Column>

      <Column md={9} sm={12}>
        <SkeletonBone />
        <SkeletonBone />
        <SkeletonBone />
      </Column>
    </Grid>
  </>
)

const SkeletonBone = styled.div`
  position: relative;
  height: 30px;
  width: 100%;
  overflow: hidden;
  background-color: ${({theme}) => theme.darkLightFg};
  margin-bottom: 6px;
  border-radius: 4px;
  opacity: 0.15;

  &:last-of-type {
    margin-bottom: 0;
  }
  
  &:before {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transform: translateX(-100%);
    content: '';
    background: linear-gradient(0.25turn, transparent, #fff, transparent);
    pointer-events: none;
    animation: skeleton-animation 2s infinite;
  }

  @keyframes skeleton-animation {
    0% {
      transform: translateX(-100%);
    }
    30% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`

const SkeletonImageContainer = styled(SkeletonBone)`
  height: 100px;
  border-radius: 4px;
  margin-bottom: 6px;
`
