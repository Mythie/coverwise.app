import { useMutation } from 'react-query';

import { TFetchResumeTextRequest, ZFetchResumeTextResponse } from './_schema';

export const fetchResumeText = async (options: TFetchResumeTextRequest) => {
  const { fileName, fileExtension, binaryData } = options;

  const response = await fetch('/api/fetchResume', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      fileName,
      fileExtension,
      binaryData,
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const result = await response.json();

  const parsed = ZFetchResumeTextResponse.safeParse(result);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  if ('error' in parsed.data) {
    throw new Error(parsed.data.error);
  }

  return parsed.data;
};

export const useFetchResumeTextMutation = () => {
  return useMutation((options: TFetchResumeTextRequest) => fetchResumeText(options), {
    retry: false,
  });
};
