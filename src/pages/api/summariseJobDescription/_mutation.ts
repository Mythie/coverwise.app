import { useMutation } from 'react-query';

import { TSummariseJobDescriptionRequest, ZSummariseJobDescriptionResponse } from './_schema';

export const summariseJobDescription = async (options: TSummariseJobDescriptionRequest) => {
  const { jobDescription } = options;

  const response = await fetch('/api/summariseJobDescription', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      jobDescription,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const result = await response.json();

  const parsed = ZSummariseJobDescriptionResponse.safeParse(result);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  if ('error' in parsed.data) {
    throw new Error(parsed.data.error);
  }

  return parsed.data;
};

export const useSummariseJobDescriptionMutation = () => {
  return useMutation(
    (options: TSummariseJobDescriptionRequest) => summariseJobDescription(options),
    {
      retry: false,
    },
  );
};
