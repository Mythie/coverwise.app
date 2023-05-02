import { load } from 'cheerio';

export const loadSafe = (html: string) => {
  try {
    return load(html);
  } catch (error) {
    return null;
  }
};
