import i18n from "../i18n"
import { StepperFunc, StepperLoopFuncResult } from "./types"


/** Returns a function that attempts to iterate over the given operators sequentially and reports any corresponding events */
export function makeStepperLoopFunction(operations: StepperFunc[]) {
  return async (startIdx: number = 0): Promise<StepperLoopFuncResult> => {
    for (let i = startIdx; i < operations.length; i++) {
      try {
        const op = operations[i]
        const { error, waitNext } = await op()

        // Stop on failure or refresh needed
        if (error) return { continueFrom: i, error }
        else if (waitNext) {
          return { continueFrom: i + 1 }
        }
      }
      catch (err) {
        return { continueFrom: i, error: err.message }
      }
    }
    return { continueFrom: operations.length } // DONE
  }
}

export const areAllNumbers = (slice: any[]) => {
  for (let i = 0; i < slice.length; i++) {
    if (typeof slice[i] !== 'number') {
      return false;
    }
  }
  return true;
}

export function limitedText(str: string, maxLength: number = 60): string {
  if (!str || !str.length || str.length < maxLength) return str;

  return str.substr(0, maxLength) + '...';
}
export function throwIfNotBrowser() {
  if (typeof window == 'undefined')
    throw new Error(
      'The storage component should only be used on the web browser side'
    );
}


/** Transforms a CSS hex value like #F7F7F7 into an rgba() component */
export function hexToRgbA(hex: string, opacity: number = 1): string {
  if (opacity > 1) opacity = 1
  else if (opacity < 0) opacity = 0

  if (!hex.match(/^#?([A-Fa-f0-9]{3}){1,2}$/)) throw new Error("Invalid hex value")

  hex = hex.replace("#", "")
  if (hex.length == 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * @param address - address to modify
 * @param slashIndex - number of letters to show at beginning of address
 * @returns formatted address
 */
export function shortAddress(address: string, slashIndex = 15): string {
  // An ethereum address has 42 characters
  return address.slice(0, slashIndex) + '...' + address.slice(38, 42);
}

export function checkStrength(passphrase: string): string {
  if (!passphrase) return i18n.t("errors.the_passphrase_is_empty")
  else if (passphrase.length < 8) return i18n.t("errors.the_passphrase_should_have_8_characters_or_more")
  else if (!passphrase.match(/[A-Z]/)) return i18n.t("errors.the_passphrase_should_contain_some_uppercase_characters")
  return null
}
