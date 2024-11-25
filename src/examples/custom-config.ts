import { LLMContextExtractor } from '../llm-context-extractor';

async function customConfigExample() {
  const extractor = new LLMContextExtractor();

  // Example with different configurations
  const configurations = [
    {
      name: 'Minimal Config',
      options: {
        maxTokens: 1000,
        includeSummary: false,
        format: 'text'
      }
    },
    {
      name: 'Full Context',
      options: {
        maxTokens: 4000,
        includeSummary: true,
        includeMetadata: true,
        format: 'markdown',
        cleanupOptions: {
          removeScripts: true,
          removeStyles: true,
          removeComments: true,
          condenseParagraphs: true
        }
      }
    }
  ];

  const url = 'https://www.bbc.com/news/technology';

  for (const config of configurations) {
    try {
      console.log(`\nTesting configuration: ${config.name}`);
      const result = await extractor.extract(url, config.options);
      
      console.log({
        title: result.title,
        tokenCount: result.tokens,
        hasSummary: !!result.summary,
        hasMetadata: !!result.metadata,
        contentPreview: result.content.slice(0, 100) + '...'
      });
    } catch (error) {
      console.error(`Failed with ${config.name}:`, error.message);
    }
  }
}

customConfigExample();