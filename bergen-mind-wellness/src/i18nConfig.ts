import type { Config } from 'next-i18n-router/dist/types';

const i18nConfig: Config = {
  locales: ['en', 'es'],
  defaultLocale: 'en',
  // Don't prefix default locale (English stays as /, Spanish becomes /es/*)
  prefixDefault: false,
};

export default i18nConfig;
