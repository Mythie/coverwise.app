import { useMutation } from 'react-query';

import { TSummariseResumeRequest, ZSummariseResumeResponse } from './_schema';

export const summariseResume = async (options: TSummariseResumeRequest) => {
  const { resume } = options;

  const response = await fetch('/api/summariseResume', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      resume,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const result = await response.json();

  const parsed = ZSummariseResumeResponse.safeParse(result);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  if ('error' in parsed.data) {
    throw new Error(parsed.data.error);
  }

  return parsed.data;
};

export const useSummariseResumeMutation = () => {
  return useMutation((options: TSummariseResumeRequest) => summariseResume(options), {
    retry: false,
  });
};
