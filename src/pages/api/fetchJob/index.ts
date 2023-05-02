import { NextApiRequest, NextApiResponse } from 'next';

import { loadSafe } from '@/lib/cheerio';
import { fetchJobTextContent, validJobBoardUrl } from '@/lib/job-board-fetcher';

import { ZFetchJobRequest } from './_schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method?.toUpperCase() !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers['content-type']?.toLowerCase() !== 'application/json') {
    return res.status(400).json({ error: 'Invalid content type' });
  }

  const parsed = ZFetchJobRequest.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }

  const { url, jobBoard } = parsed.data;

  if (jobBoard === 'OTHER') {
    return res.status(400).json({ error: 'Invalid job board' });
  }

  if (!validJobBoardUrl(url, jobBoard)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const response = await fetch(url, {
    redirect: 'follow',
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: response.statusText });
  }

  const text = await response.text();

  const doc = loadSafe(text);

  if (!doc) {
    return res.status(400).json({ error: 'Invalid HTML' });
  }

  const textContent = fetchJobTextContent(doc, jobBoard);

  return res.json({
    textContent,
  });
}
