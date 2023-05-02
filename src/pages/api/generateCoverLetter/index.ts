import { NextApiRequest, NextApiResponse } from 'next';

import { Configuration, OpenAIApi } from 'openai';

import { AvailableModel } from '@/data/open-ai';
import { logT } from '@/lib/performance';

import { TGenerateCoverLetterResponse, ZGenerateCoverLetterRequest } from './_schema';

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
  res: NextApiResponse<TGenerateCoverLetterResponse>,
) {
  if (req.method?.toUpperCase() !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers['content-type']?.toLowerCase() !== 'application/json') {
    return res.status(400).json({ error: 'Invalid content type' });
  }

  const parsed = ZGenerateCoverLetterRequest.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  const {
    summarisedResume,
    summarisedJobDescription,
    tone,
    model = DEFAULT_OPENAI_MODEL,
  } = parsed.data;

  const stopTimer = logT('Generate cover letter');

  const coverLetter = await DEFAULT_OPENAI_CLIENT.createChatCompletion({
    model,
    messages: [
      {
        role: 'user',
        content: [
          'You are an expert editor, you specialise in writing cover letters for candidates where you highlight their skills without talking about the specific componies they worked for.',
          'DO NOT MENTION THE CANDIDATES PREVIOUS EMPLOYERS IN THE COVER LETTER.',
          'Use line breaks to increase readability.',
          `Given the following resume and role description write a cover letter for the candidate which is between 150-300 words using a ${tone} tone:`,
          '--- START RESUME---',
          summarisedResume,
          '--- END RESUME ---',
          '--- START JOB DESCRIPTION---',
          summarisedJobDescription,
          '--- END JOB DESCRIPTION ---',
        ].join('\n'),
      },
    ],
    temperature: 0.5,
  })
    .then((res) => res.data.choices[0].message?.content)
    .catch(() => null);

  stopTimer();

  if (!coverLetter) {
    return res.status(500).json({ error: 'Failed to generate cover letter' });
  }

  return res.json({
    coverLetter,
  });
}
