import { generateSlug } from 'random-word-slugs';

export const randomLetters = (length: number = 10) => {
  let s = '';
  do {
    s += Math.random().toString(36).substring(2);
  } while (s.length < length);
  s = s.substring(0, length);
  return s;
};

export const randomWords = (wordCount: number = 2) => {
  const slug = generateSlug(wordCount, {
    format: 'kebab',
  }).replace('-', '');
  return slug;
};
