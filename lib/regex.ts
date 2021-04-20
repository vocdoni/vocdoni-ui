const HEX_REGEX = /^(0x)?[0-9a-fA-F]+$/
const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i
const URI_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/

export function isValidEmail(text: string): boolean {
  return EMAIL_REGEX.test(text)
}

export function isValidHexString(text: string): boolean {
  return HEX_REGEX.test(text)
}

export function isUri(text: string): boolean {
  return URI_REGEX.test(text)
}
