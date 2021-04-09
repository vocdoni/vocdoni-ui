const HEX_REGEX = /^(0x)?[0-9a-fA-F]+$/
const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i

export function isValidEmail(text: string): boolean {
  return EMAIL_REGEX.test(text)
}

export function isValidHexString(text: string): boolean {
  return HEX_REGEX.test(text)
}
