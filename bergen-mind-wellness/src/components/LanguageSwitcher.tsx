'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18nConfig from '@/i18nConfig';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const handleChange = (newLocale: string) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${date.toUTCString()};path=/`;

    // Redirect to the new locale path
    if (currentLocale === i18nConfig.defaultLocale && !i18nConfig.prefixDefault) {
      // Current path is like /about, need to add locale prefix
      router.push('/' + newLocale + currentPathname);
    } else {
      // Current path is like /es/about, replace locale prefix
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };

  return (
    <div className="relative">
      <select
        onChange={(e) => handleChange(e.target.value)}
        value={currentLocale}
        className="appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}
