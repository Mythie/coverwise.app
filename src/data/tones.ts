export const TONES = ['casual', 'formal', 'friendly', 'professional'] as const;

export const isTone = (tone: string): tone is Tone => {
  // This is for a type guard so we allow the eslint rule to be disabled
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return TONES.includes(tone as Tone);
};

export const TONE_FRIENDLY_NAMES: Record<(typeof TONES)[number], string> = {
  casual: 'Casual',
  formal: 'Formal',
  friendly: 'Friendly',
  professional: 'Professional',
};

export type Tone = (typeof TONES)[number];
