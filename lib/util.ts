import { ProcessStatus } from 'dvote-js';
import { ethers, Wallet } from 'ethers'
import i18n from '../i18n'
import { GlobalWindowNoDefinedError } from './validators/errors/global-window-no-defined-error';

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
    throw new GlobalWindowNoDefinedError();
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

export const importedRowToString = (row: string[], entityId: string): string => {
  return row.reduce((i, j) => { return i + j }) + entityId
}

export const digestedWalletFromString = (data: string): Wallet => {
  const bytes = ethers.utils.toUtf8Bytes(data)
  const hashed = ethers.utils.keccak256(bytes)
  return new ethers.Wallet(hashed)
}

/** Waits for a Vochain block, multiplied by the given factor (by default, 1) */
export function waitBlockFraction(factor: number = 1) {
  const delay = parseInt(process.env.BLOCK_TIME) * 1000 * factor

  return new Promise((resolve) =>
    setTimeout(resolve, Math.floor(delay))
  )
}

/** Returns a reduces string, removing the most typical mismatch sources (case, spaces, etc) */
export const normalizeSpreadsheetColum = (data: string): string => {
  return data.trim().replace(/[\s]+/g, " ").toLowerCase()
}



export enum VoteStatus {
  Unknown = -1,
  Active,
  Paused,
  Ended,
  Canceled,
  Upcoming,
}

export const getVoteStatus = (processStatus, startBlock?, currentBlock?): VoteStatus => {
  switch (processStatus.value) {
    case ProcessStatus.READY:
      if (startBlock == undefined || currentBlock == undefined) return VoteStatus.Unknown
      if (startBlock > currentBlock) return VoteStatus.Upcoming
      return VoteStatus.Active

    case ProcessStatus.ENDED:
      return VoteStatus.Ended

    case ProcessStatus.PAUSED:
      return VoteStatus.Paused

    case ProcessStatus.CANCELED:
      return VoteStatus.Canceled

    case ProcessStatus.RESULTS:
      return VoteStatus.Ended

    default:
      return VoteStatus.Unknown
  }
}

export function hasDuplicates<T>(values: T[]): boolean {
  const seen: T[] = []
  for (let v of values) {
    if (seen.includes(v)) return true
    seen.push(v)
  }
  return false
}


type FileDownloadParams = {
  fileName?: string
  mime?: string
}
export const downloadFile = (payload: Uint8Array, params: FileDownloadParams = {}) => {
  if (!params.fileName) params.fileName = 'vocdoni.dat'
  if (!params.mime) params.mime = 'application/octet-stream'

  const element = document.createElement("a")
  const file = new Blob([payload], { type: `${params.mime};charset=utf-8` })
  element.href = URL.createObjectURL(file)
  element.download = params.fileName
  document.body.appendChild(element)
  element.click()
  element.remove()
}
