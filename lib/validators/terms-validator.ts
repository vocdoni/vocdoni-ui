import { TermsError } from "./errors/terms-error";


export const termsValidator = (terms: boolean) => (
  terms? null: new TermsError()
)