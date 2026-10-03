export type Lang = 'pt-br' | 'en';

export const ui = {
  'pt-br': {
    created: 'Criado',
    readNext: 'Continue lendo',
    readingTime: (min: number) => `~${min} min`,
    notFound: 'Esta página não existe ou mudou de endereço.',
    seePosts: 'Ver os posts',
  },
  en: {
    created: 'Created',
    readNext: 'Keep reading',
    readingTime: (min: number) => `~${min} min read`,
    notFound: "This page doesn't exist or has moved.",
    seePosts: 'See the posts',
  },
} as const;

const TIME_ZONE = 'America/Sao_Paulo';

export function formatDate(date: Date, lang: Lang = 'pt-br') {
  return date.toLocaleDateString(lang, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TIME_ZONE });
}

// Posts without a recorded time were saved at 00:00; show only the date for those.
function isMidnight(date: Date) {
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: TIME_ZONE });
  return time === '00:00';
}

export function formatDateTime(date: Date, lang: Lang = 'pt-br') {
  if (isMidnight(date)) return formatDate(date, lang);
  const time = date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', timeZone: TIME_ZONE });
  return `${formatDate(date, lang)} ${time}`;
}
