import { UseRudderStackProvider } from "@hooks/rudderstack";
import React, { ReactNode } from "react";

interface IEmptyProvidersProps {
  children: ReactNode
}

export const EmptyProviders = ({ children }: IEmptyProvidersProps) => (
  <UseRudderStackProvider>
    {children}
  </UseRudderStackProvider>
)
