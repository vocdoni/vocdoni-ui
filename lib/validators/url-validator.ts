import { InvalidUrlError } from "./errors/invalid-url-error"

const linkRegexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

export const urlValidator = (link: string): Error => linkRegexp.test(link)? null: new InvalidUrlError()

export const optionalUrlValidator = (link: string): Error => (!link) || linkRegexp.test(link)? null : new InvalidUrlError()
