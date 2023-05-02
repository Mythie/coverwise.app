import { type CheerioAPI } from 'cheerio';

export type JobBoardFetcherFn = (_doc: CheerioAPI) => string | Promise<string>;
export type JobBoardUrlValidatorFn = (_url: URL) => boolean;
