import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

interface IRedirectProps {
  to: string
}

export const Redirect = ({to}: IRedirectProps) => {
  const router = useRouter()
  useEffect(() => {
    router.replace(to);
  }, [to])
  
  return <></>
}