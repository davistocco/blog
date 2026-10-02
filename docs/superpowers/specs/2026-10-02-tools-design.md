# Tools page: CPF and CNPJ (design)

## Intent
`/tools` stops listing what Davi uses and becomes a set of working utilities for real use (QA, devs, himself). First batch: CPF and CNPJ, each with generate + validate. Everything runs in the browser; no backend, static Astro on GH Pages is unchanged.

## Structure
- `src/pages/tools/index.astro`: index, one entry per tool (name + one-line description).
- `src/pages/tools/cpf.astro`, `src/pages/tools/cnpj.astro`: one page per tool (linkable, searchable).
- `src/lib/cpf.ts`, `src/lib/cnpj.ts`: pure functions, no DOM.
- Removed: `src/pages/tools.astro`, `src/lib/tools.ts`. Footer link to `tools/` stays.
- Styles: reuse existing tokens/typography in `global.css`; replace the old `.tools` / `.tool-group` rules with what the new pages need.

## Logic API
- `cpf.ts`: `generateCpf({ masked, uf? }): string`, `validateCpf(input): { valid: boolean; reason?: 'length' | 'repeated' | 'digit' }`.
  - `uf` sets the 9th digit (fiscal region).
  - Validator accepts masked or unmasked input.
- `cnpj.ts`: `generateCnpj({ masked, alphanumeric }): string`, `validateCnpj(input)` same result shape.
  - Alphanumeric CNPJ (Receita Federal, since July 2026): 12 base chars `[0-9A-Z]`, 2 numeric check digits, mod-11 over `charCode - 48`.
  - Validator accepts both formats; masks `XX.XXX.XXX/XXXX-XX`.
  - Generator uses a branch of `0001` by default.

## UI (per tool page)
- Generator: result with copy button; "mascarar" checkbox; "Gerar" button; quantity (1–50, one per line); CPF: optional UF select; CNPJ: numérico/alfanumérico toggle.
- Validator: text input, live result "válido" / "inválido" with the reason in PT-BR.
- Short note: numbers are for testing only, belong to no real person/company, and nothing leaves the browser.
- Small inline `<script>` per page importing the lib; works with the light/dark toggle; usable at phone width.

## Testing
Unit tests on the lib functions using `node --test` (no new dependency if the Node version strips TS types; otherwise add `tsx` as a devDependency). Cases: known valid/invalid values, repeated digits, wrong length, masked input, generated values always validate (loop), alphanumeric CNPJ vectors. Plus `pnpm build` and a manual check of both pages in the dev server.

## Out of scope
Other tools (RG, CEP, UUID, JSON...), per-tool OG images, i18n. Future ideas go to `IDEAS.md`.
