export type Lang = 'pt-br' | 'en';

export const ui = {
  'pt-br': {
    created: 'Criado',
    readNext: 'Continue lendo',
    readingTime: (min: number) => `~${min} min`,
    notFound: 'Página não encontrada',
  },
  en: {
    created: 'Created',
    readNext: 'Keep reading',
    readingTime: (min: number) => `~${min} min read`,
    notFound: 'Page not found',
  },
} as const;

const TIME_ZONE = 'America/Sao_Paulo';

export function formatDate(date: Date, lang: Lang = 'pt-br') {
  return date.toLocaleDateString(lang, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TIME_ZONE });
}

export function formatDateTime(date: Date, lang: Lang = 'pt-br') {
  const time = date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', timeZone: TIME_ZONE });
  return `${formatDate(date, lang)} ${time}`;
}
