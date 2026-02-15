import { describe, it, expect } from 'vitest';
import { isNonEmptyString, isValidEmail } from './validation';

describe('validation', () => {
  describe('isNonEmptyString', () => {
    it('returns true for non-empty string', () => {
      expect(isNonEmptyString('hello')).toBe(true);
    });
    it('returns false for empty string', () => {
      expect(isNonEmptyString('')).toBe(false);
    });
    it('returns false for whitespace-only', () => {
      expect(isNonEmptyString('   ')).toBe(false);
    });
    it('returns false for non-string', () => {
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('returns true for valid email', () => {
      expect(isValidEmail('a@b.co')).toBe(true);
      expect(isValidEmail('user@example.com')).toBe(true);
    });
    it('returns false for invalid email', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('no-at')).toBe(false);
      expect(isValidEmail('@nodomain')).toBe(false);
    });
  });
});
