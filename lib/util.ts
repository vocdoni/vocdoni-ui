import { VochainProcessStatus as ProcessStatus, bufferToBigInt, Poseidon } from 'dvote-js'
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
  else if (!passphrase.match(/^(?=.*[a-z])(?=.*[A-Z])[\w\W\d]{8,}$/)) return i18n.t("errors.the_passphrase_should_contain_some_uppercase_characters_and_length_8")
  return null
}

export const importedRowToString = (row: string[], entityId: string): string => {
  return row.reduce((i, j) => { return i + j }) + entityId
}

export const digestedPrivateKeyFromString = (data: string): string => {
  const bytes = ethers.utils.toUtf8Bytes(data)
  return ethers.utils.keccak256(bytes)
}

export const digestedWalletFromString = (data: string): Wallet => {
  const bytes = ethers.utils.toUtf8Bytes(data)
  const hashed = ethers.utils.keccak256(bytes)
  return new ethers.Wallet(hashed)
}

export const calculateAnonymousKey = (privKey: string, password: string, entityId): bigint => {
  return bufferToBigInt(Buffer.from(importedRowToString([password, privKey], entityId), "utf-8")) % Poseidon.Q
}

/** Waits for a Vochain block, multiplied by the given factor (by default, 1) */
export function waitBlockFraction(factor: number = 1) {
  const delay = parseInt(process.env.BLOCK_TIME) * 1000 * factor

  return new Promise((resolve) =>
    setTimeout(resolve, Math.floor(delay))
  )
}

export enum VoteStatus {
  Unknown = -1,
  Active,
  Paused,
  Ended,
  Canceled,
  Upcoming,
}

export const getVoteStatus = (state, currentBlock?): VoteStatus => {
  if (state === undefined || currentBlock === undefined ||
    !state?.status || !state?.startBlock) return VoteStatus.Unknown

  if (state?.archived) return VoteStatus.Ended
  const processStatus = state.status
  const startBlock = state.startBlock
  const endBlock = state.endBlock

  switch (processStatus) {
    case ProcessStatus.READY:
      if (startBlock == undefined || currentBlock == undefined) return VoteStatus.Unknown
      if (startBlock > currentBlock) return VoteStatus.Upcoming
      if (currentBlock > endBlock) return VoteStatus.Ended

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
