export const JOB_BOARD_KEYS = ['SEEK', 'SEEK_NZ', 'INDEED', 'OTHER'] as const;

export type JobBoardKey = (typeof JOB_BOARD_KEYS)[number];

export const isJobBoardKey = (jobBoard: string): jobBoard is JobBoardKey => {
  // This is for a type guard so we allow the eslint rule to be disabled
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return JOB_BOARD_KEYS.includes(jobBoard as JobBoardKey);
};

export interface JobBoard {
  label: string;
  url: string;
  type: JobBoardKey | string;
}

export const JOB_BOARDS: Record<JobBoardKey, JobBoard> = {
  SEEK: {
    label: 'Seek.com.au',
    url: 'https://www.seek.com.au/',
    type: 'SEEK',
  },
  SEEK_NZ: {
    label: 'Seek.co.nz',
    url: 'https://www.seek.co.nz/',
    type: 'SEEK_NZ',
  },
  INDEED: {
    label: 'Indeed.com',
    url: 'https://www.indeed.com/',
    type: 'INDEED',
  },
  OTHER: {
    label: 'Other',
    url: '',
    type: 'OTHER',
  },
};
