// Shared helpers for the CPF tool.
export type Reason = 'length' | 'chars' | 'repeated' | 'digit';
export type Validation = { valid: true } | { valid: false; reason: Reason };

export function randomInt(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

// Mod-11 check digit used by CPF: remainders 0 and 1 give 0.
export function checkDigit(values: number[], weights: number[]): number {
  const sum = values.reduce((acc, v, i) => acc + v * weights[i], 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}
