import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import unfluff from 'unfluff';
import { htmlToText } from 'html-to-text';
import testUrls from './test-urls.ts';

async function compareExtractors(url: string) {
  const results = [];
  const response = await fetch(url);
  const html = await response.text();
  
  // Test 1: Mozilla Readability
  try {
    results.push('\n=== Mozilla Readability ===');
    const doc = new JSDOM(html);
    const reader = new Readability(doc.window.document);
    const article = reader.parse();
    results.push(JSON.stringify({
      title: article?.title,
      excerpt: article?.excerpt,
      length: article?.length,
      content: article?.textContent
    }, null, 2));
  } catch (e) {
    results.push(`Readability error: ${e}`);
  }

  // Test 2: node-unfluff
  try {
    results.push('\n=== node-unfluff ===');
    const data = unfluff(html);
    results.push(JSON.stringify({
      title: data.title,
      description: data.description,
      author: data.author,
      date: data.date,
      text: data.text
    }, null, 2));
  } catch (e) {
    results.push(`unfluff error: ${e}`);
  }

  // Test 3: html-to-text
  try {
    results.push('\n=== html-to-text ===');
    const text = htmlToText(html, {
      wordwrap: 130,
      ignoreImage: true,
      ignoreHref: true
    });
    results.push(JSON.stringify({
      text: text
    }, null, 2));
  } catch (e) {
    results.push(`html-to-text error: ${e}`);
  }

  // Test 4: article-extractor
  try {
    results.push('\n=== article-extractor ===');
    const { extract } = await import('@extractus/article-extractor');
    const article = await extract(url);
    results.push(JSON.stringify({
      title: article?.title,
      author: article?.author,
      published: article?.published,
      content: article?.content
    }, null, 2));
  } catch (e) {
    results.push(`article-extractor error: ${e}`);
  }

  // Write results to file using Deno API
  const fileName = `comparison-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
  const content = `URL: ${url}\n\n${results.join('\n')}`;
  await Deno.writeTextFile(fileName, content);
  console.log(`Results written to ${fileName}`);
}

async function runTests() {
  for (const url of testUrls) {
    console.log(`\n\n=== Testing URL: ${url} ===\n`);
    await compareExtractors(url);
  }
}

runTests().catch(console.error);