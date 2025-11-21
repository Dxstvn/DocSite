import { createInstance, Namespace, FlatNamespace, KeyPrefix } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import i18nConfig from './i18nConfig';

export default async function initTranslations(
  locale: string,
  namespaces: string | string[],
  i18nInstance?: any,
  resources?: any
) {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales,
  });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}

export function useTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FlatNamespace> = undefined
>(
  lng: string,
  ns?: Ns,
  options?: { keyPrefix?: KPrefix }
): {
  t: any;
  i18n: any;
} {
  const i18nextInstance = createInstance();
  initReactI18next.init(i18nextInstance);

  i18nextInstance.use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`)
    )
  );

  i18nextInstance.init({
    lng,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: ns as string,
    ns: ns as string,
  });

  return {
    t: i18nextInstance.getFixedT(lng, ns, options?.keyPrefix),
    i18n: i18nextInstance,
  };
}
