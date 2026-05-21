const PHONE_CLEANUP_REGEX = /[\s()-]/g;

const normalizeToDigits = (value: string) => value.replace(PHONE_CLEANUP_REGEX, '');

export const sanitizePakistaniPhoneNumber = (value: unknown) => {
  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  return normalizeToDigits(trimmed);
};

export const normalizePakistaniPhoneNumber = (value: unknown) => {
  const sanitized = sanitizePakistaniPhoneNumber(value);
  if (!sanitized) return undefined;

  if (/^\+923\d{9}$/.test(sanitized)) {
    return sanitized;
  }

  if (/^923\d{9}$/.test(sanitized)) {
    return `+${sanitized}`;
  }

  if (/^03\d{9}$/.test(sanitized)) {
    return `+92${sanitized.slice(1)}`;
  }

  if (/^00923\d{9}$/.test(sanitized)) {
    return `+${sanitized.slice(2)}`;
  }

  return undefined;
};

export const getPakistaniPhoneLookupCandidates = (value: unknown) => {
  const sanitized = sanitizePakistaniPhoneNumber(value);
  if (!sanitized) return [];

  const canonical = normalizePakistaniPhoneNumber(sanitized);
  const candidates = [sanitized];

  if (canonical) {
    candidates.push(canonical);
  }

  if (sanitized.startsWith('0') && /^03\d{9}$/.test(sanitized)) {
    candidates.push(`+92${sanitized.slice(1)}`);
  }

  return Array.from(new Set(candidates));
};