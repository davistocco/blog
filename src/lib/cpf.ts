import { checkDigit, randomInt, type Validation } from './doc.ts';

// The 9th digit of a CPF encodes the fiscal region where it was issued.
const REGION_BY_UF: Record<string, number> = {
  DF: 1, GO: 1, MS: 1, MT: 1, TO: 1,
  AC: 2, AM: 2, AP: 2, PA: 2, RO: 2, RR: 2,
  CE: 3, MA: 3, PI: 3,
  AL: 4, PB: 4, PE: 4, RN: 4,
  BA: 5, SE: 5,
  MG: 6,
  ES: 7, RJ: 7,
  SP: 8,
  PR: 9, SC: 9,
  RS: 0,
};

export const CPF_UFS = Object.keys(REGION_BY_UF).sort();

const digitsFor = (base: number[]): number[] => {
  const d1 = checkDigit(base, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = checkDigit([...base, d1], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return [d1, d2];
};

export const formatCpf = (digits: string): string =>
  `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;

export function generateCpf({ masked = false, uf }: { masked?: boolean; uf?: string } = {}): string {
  let base: number[];
  do {
    base = Array.from({ length: 9 }, () => randomInt(10));
    if (uf && uf in REGION_BY_UF) base[8] = REGION_BY_UF[uf];
  } while (base.every((d) => d === base[0])); // 111.111.111-11 etc. are invalid
  const digits = [...base, ...digitsFor(base)].join('');
  return masked ? formatCpf(digits) : digits;
}

export function validateCpf(input: string): Validation {
  const digits = input.replace(/[.\-\s]/g, '');
  if (!/^\d+$/.test(digits)) return { valid: false, reason: 'chars' };
  if (digits.length !== 11) return { valid: false, reason: 'length' };
  if (/^(\d)\1{10}$/.test(digits)) return { valid: false, reason: 'repeated' };
  const nums = [...digits].map(Number);
  const expected = digitsFor(nums.slice(0, 9));
  return expected[0] === nums[9] && expected[1] === nums[10]
    ? { valid: true }
    : { valid: false, reason: 'digit' };
}
