import { JobBoardFetcherFn } from '../types';

export const JOB_TITLE_SELECTOR = '[data-automation="job-detail-title"]';

export const JOB_COMPANY_SELECTOR = '[data-automation="advertiser-name"]';

export const JOB_CONTENT_SELECTOR = '[data-automation="jobAdDetails"]';

export const fetchJobContentFromSeekAustralia: JobBoardFetcherFn = (doc) => {
  const jobTitle = doc(JOB_TITLE_SELECTOR).text();
  const jobCompany = doc(JOB_COMPANY_SELECTOR).text();
  const jobContent = doc(JOB_CONTENT_SELECTOR).text();

  return [jobTitle, jobCompany, jobContent].join('\n');
};
