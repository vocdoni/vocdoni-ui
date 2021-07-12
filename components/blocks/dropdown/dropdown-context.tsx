import { createContext } from "react";


interface IDropdownContext {
  onClickElement?: () => void
}
export const DropDownContext = createContext<IDropdownContext>({})
