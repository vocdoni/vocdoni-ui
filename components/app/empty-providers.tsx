import React, { ReactNode } from "react";

interface IEmptyProvidersProps {
  children: ReactNode
}

export const EmptyProviders = ({ children }: IEmptyProvidersProps) => (
  <>
    {children}
  </>
)