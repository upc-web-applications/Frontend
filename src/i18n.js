/**
 * @author u20241a322  Blancas Chavez, Carlos Franco
 */
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'

const savedLocale = localStorage.getItem('riskguard-locale')
const locale = ['es', 'en'].includes(savedLocale) ? savedLocale : 'es'

const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: { en, es }
})

export default i18n
