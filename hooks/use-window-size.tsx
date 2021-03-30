import { useState, useEffect } from 'react'
import { size } from '../theme'

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
  return width < size.tablet
}
