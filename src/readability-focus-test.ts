import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

interface ReadabilityOptions {
  charThreshold?: number;
  classesToPreserve?: string[];
  keepClasses?: boolean;
  maxElemsToParse?: number;
  nbTopCandidates?: number;
  weightClasses?: boolean;
}

async function testReadability(url: string, options?: ReadabilityOptions) {
  try {
    console.log(`\nTesting URL: ${url}`);
    const response = await fetch(url);
    const html = await response.text();
    
    const doc = new JSDOM(html);
    const reader = new Readability(doc.window.document, {
      charThreshold: options?.charThreshold ?? 500,
      classesToPreserve: options?.classesToPreserve ?? [],
      keepClasses: options?.keepClasses ?? false,
      maxElemsToParse: options?.maxElemsToParse ?? 0,
      nbTopCandidates: options?.nbTopCandidates ?? 5,
      weightClasses: options?.weightClasses ?? true
    });

    const article = reader.parse();

    const results = {
      title: article?.title,
      byline: article?.byline,
      excerpt: article?.excerpt,
      siteName: article?.siteName,
      length: article?.length,
      textContent: article?.textContent?.slice(0, 500) + '...', // First 500 chars for preview
      contentLength: article?.textContent?.length,
      hasContent: article !== null,
      readingTime: article?.textContent ? 
        Math.ceil(article.textContent.split(' ').length / 200) : // Assuming 200 WPM reading speed
        0,
      options: options
    };

    // Write results to file
    const fileName = `readability-test-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    await Deno.writeTextFile(fileName, JSON.stringify(results, null, 2));
    console.log(`Results written to ${fileName}`);
    
    return results;
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
    return null;
  }
}

// Test different configurations
async function runReadabilityTests() {
  const testUrls = [
    'https://www.bbc.com/news/articles/c93716xdgzqo',
    // Add more test URLs here
  ];

  const testConfigurations = [
    {
      name: 'Default Settings',
      options: {}
    },
    {
      name: 'Strict Parsing',
      options: {
        charThreshold: 1000,
        nbTopCandidates: 3,
        weightClasses: true
      }
    },
    {
      name: 'Preserve Classes',
      options: {
        keepClasses: true,
        classesToPreserve: ['article', 'content', 'main']
      }
    },
    {
      name: 'Limited Parsing',
      options: {
        maxElemsToParse: 1000,
        charThreshold: 200
      }
    }
  ];

  for (const url of testUrls) {
    console.log(`\n=== Testing URL: ${url} ===`);
    
    for (const config of testConfigurations) {
      console.log(`\nConfiguration: ${config.name}`);
      const results = await testReadability(url, config.options);
      
      if (results) {
        console.log('Title:', results.title);
        console.log('Reading Time:', results.readingTime, 'minutes');
        console.log('Content Length:', results.contentLength, 'characters');
      }
    }
  }
}

runReadabilityTests().catch(console.error);