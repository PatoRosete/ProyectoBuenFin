import polyglottI18nProvider from 'ra-i18n-polyglot';
import { spanishMessages } from './spanishMessages';

export const i18nProvider = polyglottI18nProvider(
    _locale => spanishMessages, 'es'
);