import { de } from './de';
import { en } from './en';

export type Lang = 'de' | 'en';

const translations = { de, en } as const;

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first === 'en') return 'en';
  return 'de';
}

export function useTranslations(lang: Lang) {
  return translations[lang];
}

export function localePath(path: string, lang: Lang): string {
  if (lang === 'de') return path;
  if (path === '/') return '/en/';
  return `/en${path}`;
}

export function alternatePath(currentUrl: URL, targetLang: Lang): string {
  const currentLang = getLangFromUrl(currentUrl);
  if (currentLang === targetLang) return currentUrl.pathname;
  if (targetLang === 'de') {
    const stripped = currentUrl.pathname.replace(/^\/en/, '');
    return stripped || '/';
  }
  return `/en${currentUrl.pathname}`;
}
