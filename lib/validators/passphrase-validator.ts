import { InvalidPassphraseFormatError } from './errors/invalid-passphrase-format-error'
import { PassphraseNoMatchError } from './errors/passphrase-no-match-error'

const MIN_PASSPHRASE_LENGTH = 8
const passphraseRegex = /[a-zA-Z1-9]{8,20}/

export const passphraseValidator = (
  passphrase: string,
  rePassphrase: string
): Error | null => {
  if (passphrase !== rePassphrase) return new PassphraseNoMatchError()

  return passphraseRegex.test(passphrase)
    ? null
    : new InvalidPassphraseFormatError(MIN_PASSPHRASE_LENGTH)
}
