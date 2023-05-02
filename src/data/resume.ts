export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'plain/text': ['.txt'],
} as const;

export type AcceptedMimeType = keyof typeof ACCEPTED_FILE_TYPES;

export const isAcceptedMimeType = (mimeType: string): mimeType is AcceptedMimeType => {
  return Object.keys(ACCEPTED_FILE_TYPES).includes(mimeType);
};

// This only exists to satisfy the compiler since we're using `as const` above
export const MUTABLE_ACCEPTED_FILE_TYPES = Object.keys(ACCEPTED_FILE_TYPES).reduce((acc, key) => {
  if (isAcceptedMimeType(key)) {
    acc[String(key)] = [...ACCEPTED_FILE_TYPES[key]];
  }

  return acc;
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
}, {} as Record<string, string[]>);

export const ACCEPTED_FILE_TYPES_FLAT = Object.values(ACCEPTED_FILE_TYPES).flat();

export type AcceptedFileExtension = (typeof ACCEPTED_FILE_TYPES_FLAT)[number];

export const isAcceptedFileExtension = (extension: string): extension is AcceptedFileExtension => {
  // This is for a type guard so we allow the eslint rule to be disabled
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return ACCEPTED_FILE_TYPES_FLAT.includes(extension as AcceptedFileExtension);
};
