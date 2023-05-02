export const AVAILABLE_MODELS = {
  'gpt-4': 'GPT-4 (8K)',
  'gpt-4-32k': 'GPT-4 (32K)',
  'gpt-3.5-turbo': 'GPT-3.5 (ChatGPT)',
} as const;

export type AvailableModel = keyof typeof AVAILABLE_MODELS;

export const isAvailableModel = (model: string): model is AvailableModel => {
  return Object.keys(AVAILABLE_MODELS).includes(model);
};
