import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateCpf, validateCpf, CPF_UFS } from './cpf.ts';
import { generatePassword, passwordEntropy, PASSWORD_MIN, PASSWORD_MAX } from './password.ts';

test('cpf: known valid, masked or not', () => {
  assert.deepEqual(validateCpf('529.982.247-25'), { valid: true });
  assert.deepEqual(validateCpf('52998224725'), { valid: true });
});

test('cpf: rejections', () => {
  assert.deepEqual(validateCpf('529.982.247-24'), { valid: false, reason: 'digit' });
  assert.deepEqual(validateCpf('111.111.111-11'), { valid: false, reason: 'repeated' });
  assert.deepEqual(validateCpf('1234'), { valid: false, reason: 'length' });
  assert.deepEqual(validateCpf('abc.982.247-25'), { valid: false, reason: 'chars' });
});

test('cpf: generated always validate; mask and uf honored', () => {
  for (let i = 0; i < 500; i++) assert.equal(validateCpf(generateCpf()).valid, true);
  assert.match(generateCpf({ masked: true }), /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  for (const uf of CPF_UFS) {
    const cpf = generateCpf({ uf });
    assert.equal(validateCpf(cpf).valid, true);
  }
  assert.equal(generateCpf({ uf: 'SP' })[8], '8');
  assert.equal(generateCpf({ uf: 'RS' })[8], '0');
});

test('password: length, sets and guaranteed classes', () => {
  for (let i = 0; i < 300; i++) {
    const p = generatePassword({ length: 8 });
    assert.equal(p.length, 8);
    assert.match(p, /[a-z]/);
    assert.match(p, /[A-Z]/);
    assert.match(p, /\d/);
    assert.match(p, /[^a-zA-Z0-9]/);
  }
  assert.match(generatePassword({ length: 40, upper: false, symbols: false }), /^[a-z0-9]{40}$/);
  assert.match(generatePassword({ length: 40, lower: false, upper: false, symbols: false }), /^\d{40}$/);
});

test('password: length is clamped, empty selection throws, entropy', () => {
  assert.equal(generatePassword({ length: 1 }).length, PASSWORD_MIN);
  assert.equal(generatePassword({ length: 9999 }).length, PASSWORD_MAX);
  assert.throws(() => generatePassword({ lower: false, upper: false, digits: false, symbols: false }));
  assert.equal(passwordEntropy({ length: 10, lower: false, upper: false, symbols: false }), 33);
});
