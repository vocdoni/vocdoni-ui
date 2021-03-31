import { useState, useEffect } from 'react'
import { sizes } from '../theme/sizes'

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    const onResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', onResize)

    onResize()

    return () => window.removeEventListener('resize', onResize)
  }, [])

  return windowSize
}

export const useIsMobile = () => {
  const { width } = useWindowSize()
  return width < sizes.tablet
}

export const useResponsive = () => {
  const { width } = useWindowSize()
  return {
    mobile: width < sizes.tablet,
    tablet: width < sizes.laptop,
    laptop: width >= sizes.laptop
  }
}
