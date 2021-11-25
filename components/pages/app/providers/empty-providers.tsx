import React, { ReactNode } from "react";
import { UseCookiesProvider } from "@hooks/cookies";
import { UseRudderStackProvider } from "@hooks/rudderstack";

interface IEmptyProvidersProps {
  children: ReactNode
}

export const EmptyProviders = ({ children }: IEmptyProvidersProps) => (
  <UseRudderStackProvider>
    <UseCookiesProvider>
    {children}
    </UseCookiesProvider>
  </UseRudderStackProvider>
)
