import { useMutation } from 'react-query';

import { TGenerateCoverLetterRequest, ZGenerateCoverLetterResponse } from './_schema';

export const generateCoverLetter = async (options: TGenerateCoverLetterRequest) => {
  const { summarisedResume, summarisedJobDescription, tone } = options;

  const response = await fetch('/api/generateCoverLetter', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      summarisedResume,
      summarisedJobDescription,
      tone,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const result = await response.json();

  const parsed = ZGenerateCoverLetterResponse.safeParse(result);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  if ('error' in parsed.data) {
    throw new Error(parsed.data.error);
  }

  return parsed.data;
};

export const useGenerateCoverLetterMutation = () => {
  return useMutation((options: TGenerateCoverLetterRequest) => generateCoverLetter(options), {
    retry: false,
  });
};
