import i18next from 'i18next'
import moment from 'moment'
import translation from './locales'

const i18n = i18next.createInstance()

export const supportedLanguages = ['ca', 'en', 'eo', 'es']

moment.locale(process.env.LANG)

i18n.init({
	debug: process.env.NODE_ENV === 'development',
	lng: process.env.LANG,
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
