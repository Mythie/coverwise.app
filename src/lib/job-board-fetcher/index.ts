import { type CheerioAPI } from 'cheerio';

import { JobBoardKey } from '@/data/job-boards';

import { fetchJobContentFromSeekAustralia } from './fetchers/seek-australia';
import { JobBoardFetcherFn, JobBoardUrlValidatorFn } from './types';
import { validateSeekAustraliaJobUrl } from './validators/seek-australia';

const JobBoardFetchers: Partial<Record<JobBoardKey, JobBoardFetcherFn>> = {
  SEEK: fetchJobContentFromSeekAustralia,
  SEEK_NZ: fetchJobContentFromSeekAustralia,
  INDEED: fetchJobContentFromSeekAustralia,
};

const JobBoardValidators: Partial<Record<JobBoardKey, JobBoardUrlValidatorFn>> = {
  SEEK: validateSeekAustraliaJobUrl,
  SEEK_NZ: validateSeekAustraliaJobUrl,
  INDEED: validateSeekAustraliaJobUrl,
};

export function fetchJobTextContent(
  doc: CheerioAPI,
  jobBoard: JobBoardKey,
): string | Promise<string> {
  return JobBoardFetchers[jobBoard]?.(doc) ?? '';
}

export function validJobBoardUrl(url: string, jobBoard: JobBoardKey): boolean {
  const u = new URL(url);

  return JobBoardValidators[jobBoard]?.(u) ?? true;
}
