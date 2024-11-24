// Update imports to include .js extension (required for ESM)
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import unfluff from 'unfluff';
import { htmlToText } from 'html-to-text';
import testUrls from './test-urls.js';