import { LLMContextExtractor } from '../llm-context-extractor';

async function basicExample() {
  const extractor = new LLMContextExtractor();
  
  try {
    // Basic extraction
    const result = await extractor.extract('https://www.bbc.com/news/technology', {
      maxTokens: 3000,
      includeSummary: true,
      format: 'markdown'
    });

    console.log('Basic Extraction Results:');
    console.log('Title:', result.title);
    console.log('Token Count:', result.tokens);
    console.log('Summary:', result.summary);
    console.log('\nMetadata:', result.metadata);
  } catch (error) {
    console.error('Extraction failed:', error);
  }
}

basicExample();