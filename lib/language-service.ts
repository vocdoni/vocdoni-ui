
export class LanguageService {
  static storeKey = 'default-language'
  static defaultLanguage = (typeof window !== 'undefined' && typeof window.navigator.language !== 'undefined') ? window.navigator.language.substr(0, 2).toLowerCase() : process.env.LANG

  constructor() { }

  public static setDefaultLanguage(language) {
    if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(LanguageService.storeKey, language)
  }

  public static getDefaultLanguage() {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage.getItem(LanguageService.storeKey) || LanguageService.defaultLanguage

    return LanguageService.defaultLanguage
  }
}