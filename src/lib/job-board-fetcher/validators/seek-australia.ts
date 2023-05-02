import { JobBoardUrlValidatorFn } from '../types';

export const validateSeekAustraliaJobUrl: JobBoardUrlValidatorFn = (url) => {
  const { pathname, hostname } = url;

  return hostname.endsWith('seek.com.au') && pathname.startsWith('/job/');
};
