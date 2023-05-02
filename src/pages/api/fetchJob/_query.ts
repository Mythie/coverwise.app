import { useQuery } from 'react-query';

import { TFetchJobRequest, ZFetchJobResponse } from './_schema';

export const fetchJob = async (options: TFetchJobRequest) => {
  const { url, jobBoard } = options;

  const response = await fetch('/api/fetchJob', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      url,
      jobBoard,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const result = await response.json();

  const parsed = ZFetchJobResponse.safeParse(result);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  if ('error' in parsed.data) {
    throw new Error(parsed.data.error);
  }

  return parsed.data;
};

export const useFetchJobQuery = (options: TFetchJobRequest) => {
  return useQuery(['fetchJob', options], () => fetchJob(options), {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: options.jobBoard !== 'OTHER' && options.url !== '',
  });
};
