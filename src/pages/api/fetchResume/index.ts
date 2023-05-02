import { NextApiRequest, NextApiResponse } from 'next';

import { Buffer } from 'buffer';
import { toUint8Array } from 'js-base64';
import WordExtractor from 'word-extractor';

import { isAcceptedFileExtension } from '@/data/resume';
import { getPdfTextContent } from '@/lib/get-pdf-text-content';

import { ZFetchResumeTextRequest } from './_schema';

const wordExtractor = new WordExtractor();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method?.toUpperCase() !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers['content-type']?.toLowerCase() !== 'application/json') {
    return res.status(400).json({ error: 'Invalid content type' });
  }

  const parsed = ZFetchResumeTextRequest.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }

  const { fileExtension, binaryData } = parsed.data;

  const buffer = Buffer.from(toUint8Array(binaryData));

  // This won't happen thanks to the Zod validator but we still should handle for it.
  if (!isAcceptedFileExtension(fileExtension)) {
    return res.status(400).json({ error: 'Invalid file extension' });
  }

  let textContent = '';

  switch (fileExtension) {
    case '.doc':
    case '.docx':
      textContent = await wordExtractor
        .extract(buffer)
        .then((doc) => doc.getBody())
        .catch((err) => {
          console.error(err);

          return '';
        });

      break;

    case '.pdf':
      textContent = await getPdfTextContent(buffer).catch((err) => {
        console.error(err);

        return '';
      });

      break;

    case '.txt':
      textContent = buffer.toString('ascii');

      break;
  }

  if (!textContent) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  return res.json({
    textContent,
  });
}
