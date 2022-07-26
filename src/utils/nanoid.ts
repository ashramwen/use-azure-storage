import { customAlphabet, urlAlphabet } from 'nanoid';

export const nanoid = customAlphabet(urlAlphabet, 11);
