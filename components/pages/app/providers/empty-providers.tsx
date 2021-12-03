import React, { ReactNode } from "react";
import { UseCookiesProvider } from "@hooks/cookies";
import { UseRudderStackProvider } from "@hooks/rudderstack";
import { PATH_WITHOUT_COOKIES } from "@const/routes";

interface IEmptyProvidersProps {
  children: ReactNode
}

export const EmptyProviders = ({ children }: IEmptyProvidersProps) => (
  <UseRudderStackProvider>
    <UseCookiesProvider hideInPaths={PATH_WITHOUT_COOKIES}>
    {children}
    </UseCookiesProvider>
  </UseRudderStackProvider>
)
