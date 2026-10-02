export type PasswordOptions = {
  length?: number;
  lower?: boolean;
  upper?: boolean;
  digits?: boolean;
  symbols?: boolean;
};

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?',
} as const;

// Rejection sampling: `% max` alone would favor the low values.
function secureInt(max: number): number {
  const limit = 0x100000000 - (0x100000000 % max);
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf); while (buf[0] >= limit);
  return buf[0] % max;
}

const pick = (chars: string): string => chars[secureInt(chars.length)];

function activeSets({ lower = true, upper = true, digits = true, symbols = true }: PasswordOptions): string[] {
  const on = { lower, upper, digits, symbols };
  return (Object.keys(SETS) as (keyof typeof SETS)[]).filter((k) => on[k]).map((k) => SETS[k]);
}

export function generatePassword(opts: PasswordOptions = {}): string {
  const sets = activeSets(opts);
  if (sets.length === 0) throw new Error('select at least one character set');
  const length = Math.min(PASSWORD_MAX, Math.max(PASSWORD_MIN, Math.floor(opts.length ?? 16)));
  const pool = sets.join('');
  // One char from each selected set guarantees every box that is ticked shows up.
  const chars = sets.map(pick);
  while (chars.length < length) chars.push(pick(pool));
  // Fisher-Yates, so the guaranteed chars don't sit at the start.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

export function passwordEntropy(opts: PasswordOptions = {}): number {
  const poolSize = activeSets(opts).join('').length;
  const length = Math.min(PASSWORD_MAX, Math.max(PASSWORD_MIN, Math.floor(opts.length ?? 16)));
  return poolSize ? Math.round(length * Math.log2(poolSize)) : 0;
}
