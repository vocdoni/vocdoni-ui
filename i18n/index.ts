import { LanguageService } from '@lib/language-service';
import i18next from 'i18next'
import { initReactI18next } from "react-i18next";
import translation from './locales'

const i18n = i18next.createInstance()

export const supportedLanguages = ['ca']

const userLang = LanguageService.getDefaultLanguage()

i18n
	.use(initReactI18next)
	.init({
		debug: process.env.NODE_ENV === 'development',
		preload: ['ca'],
		resources: {
			translation
		},
		lng: userLang,
		fallbackLng: 'ca',
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
