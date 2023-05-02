import { NextApiRequest, NextApiResponse } from 'next';

import { Configuration, OpenAIApi } from 'openai';

import { AvailableModel } from '@/data/open-ai';
import { logT } from '@/lib/performance';

import { TSummariseJobDescriptionResponse, ZSummariseJobDescriptionRequest } from './_schema';

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
  res: NextApiResponse<TSummariseJobDescriptionResponse>,
) {
  if (req.method?.toUpperCase() !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers['content-type']?.toLowerCase() !== 'application/json') {
    return res.status(400).json({ error: 'Invalid content type' });
  }

  const parsed = ZSummariseJobDescriptionRequest.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  const { jobDescription, model = DEFAULT_OPENAI_MODEL } = parsed.data;

  const stopTimer = logT('Summarise job description');

  const summarisedJobDescription = await DEFAULT_OPENAI_CLIENT.createChatCompletion({
    model,
    messages: [
      {
        role: 'user',
        content: [
          'Summarise the following job description in 250 words:',
          'Use line breaks to increase readability.',
          '--- START JOB DESCRIPTION---',
          jobDescription,
          '--- END JOB DESCRIPTION ---',
        ].join('\n'),
      },
    ],
    temperature: 0.5,
  })
    .then((res) => res.data.choices[0].message?.content)
    .catch(() => null);

  stopTimer();

  if (!summarisedJobDescription) {
    return res.status(500).json({ error: 'Failed to summarise job description' });
  }

  return res.json({
    summarisedJobDescription,
  });
}
