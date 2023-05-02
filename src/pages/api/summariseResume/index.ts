import { NextApiRequest, NextApiResponse } from 'next';

import { Configuration, OpenAIApi } from 'openai';

import { AvailableModel } from '@/data/open-ai';
import { logT } from '@/lib/performance';

import { TSummariseResumeResponse, ZSummariseResumeRequest } from './_schema';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const DEFAULT_OPENAI_CLIENT = new OpenAIApi(
  new Configuration({
    apiKey: process.env.NEXT_PRIVATE_OPENAI_API_KEY,
  }),
);

const DEFAULT_OPENAI_MODEL: AvailableModel = 'gpt-3.5-turbo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TSummariseResumeResponse>,
) {
  if (req.method?.toUpperCase() !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers['content-type']?.toLowerCase() !== 'application/json') {
    return res.status(400).json({ error: 'Invalid content type' });
  }

  const parsed = ZSummariseResumeRequest.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  const { resume, model = DEFAULT_OPENAI_MODEL } = parsed.data;

  const timerSummariseResume = logT('Summarise resume');

  const summarisedResume = await DEFAULT_OPENAI_CLIENT.createChatCompletion({
    model,
    messages: [
      {
        role: 'user',
        content: [
          'Summarise the following resume in 250 words:',
          'Use line breaks to increase readability.',
          '--- START RESUME---',
          resume,
          '--- END RESUME ---',
        ].join('\n'),
      },
    ],
    temperature: 0.5,
  })
    .then((res) => res.data.choices[0].message?.content)
    .catch(() => null);

  timerSummariseResume();

  if (!summarisedResume) {
    return res.status(500).json({ error: 'Failed to summarise resume' });
  }

  return res.json({
    summarisedResume,
  });
}
