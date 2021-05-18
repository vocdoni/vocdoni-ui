import i18next from 'i18next'
import translation from './locales'

const i18n = i18next.createInstance()

export const supportedLanguages = ['ca', 'en', 'eo', 'es']

const userLang = (typeof window !== 'undefined' && typeof window.navigator.language !== 'undefined') ? window.navigator.language.substr(0, 2).toLowerCase() : process.env.LANG

i18n.init({
	debug: process.env.NODE_ENV === 'development',
	lng: userLang,
	fallbackLng: 'en',
	defaultNS: 'translation',
	interpolation: {
		escapeValue: false,
	},
	returnEmptyString: false,
})


for (const lang of supportedLanguages) {
  if (typeof translation[lang] !== 'undefined') {
      i18n.addResourceBundle(lang, 'translation', translation[lang])
  }
}

export default i18n
