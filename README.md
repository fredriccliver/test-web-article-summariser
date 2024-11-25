# Web Article Content Extractor Comparison

A Deno-based tool that compares different content extraction libraries for web articles. This tool helps evaluate how different libraries handle article extraction, including title, content, author, and metadata parsing.

## Features

Compares 4 popular content extraction libraries:
- Mozilla Readability
- node-unfluff
- html-to-text
- article-extractor

Extracts various content elements:
- Article title
- Main content
- Author information
- Publication date
- Article excerpts

## Prerequisites

- Deno installed on your system

## Installation

Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

## Usage

Run the comparison tool:
```bash
deno task start
```

To test with your own URLs, modify the `src/test-urls.ts` file:

```typescript
export default [
    'https://your-url-here.com',
    'https://another-url.com'
];
```

### Examples
Basic usage example:
```bash
deno task example:basic
```

Custom configuration example:
```bash
deno task example:custom
```

### Content Extraction
To extract content from a specific URL:
```bash
deno task extract
```

Or with a URL directly:
```bash
deno task extract --url "https://example.com/article"
```

Options:
- `-u, --url <url>`: URL to extract content from
- `-h, --help`: Show help message

The extractor will:
- Clean and format the article content
- Generate a summary (optional)
- Calculate token count and reading time
- Extract metadata (author, date, site name)
- Save results to a JSON file

## How It Works

The tool fetches HTML content from specified URLs and processes it through multiple content extraction libraries. Each library's implementation can be found in `src/content-extractor-comparison.ts`.

## Configuration

The tool uses `deno.json` for managing npm package imports and task definitions.

## Type Definitions

Custom type definitions for the libraries are located in the `src/types` directory:
- unfluff: `src/types/unfluff.d.ts`
- html-to-text: `src/types/html-to-text.d.ts`
- jsdom: `src/types/jsdom.d.ts`


Here's a tabular comparison of the libraries:

| Feature | Mozilla Readability | Article-extractor | Node-unfluff | HTML-to-text |
|---------|-------------------|-------------------|--------------|--------------|
| Content Quality | Excellent - clean and complete | Very Good - with HTML markup | Good - some formatting issues | Poor - noisy |
| Structure Preservation | ✅ Excellent hierarchy | ✅ Good with HTML tags | ⚠️ Partial | ❌ Poor |
| Formatting | ✅ Clean paragraphs and headers | ✅ HTML formatted | ⚠️ Inconsistent | ❌ Many line breaks |
| Metadata | Title, excerpt | Title, author, date | Title, description, author, date | None |
| Navigation/UI Removal | ✅ Complete removal | ✅ Good removal | ⚠️ Some remnants | ❌ Contains UI elements |
| Signal-to-noise Ratio | High | High | Medium | Low |
| Text Cleanliness | Very clean | Clean with HTML | Moderately clean | Very noisy |
| Link Handling | ✅ Preserved appropriately | ✅ HTML links | ⚠️ Raw URLs | ❌ Raw URLs scattered |
| Output Format | Plain text with structure | HTML | Plain text | Plain text |
| Whitespace Handling | ✅ Consistent | ✅ HTML-managed | ⚠️ Inconsistent | ❌ Excessive breaks |

Summary Rankings (Best to Worst):

1. Mozilla Readability
   - Best for LLM context
   - Cleanest output
   - Excellent structure
   - Minimal noise

2. Article-extractor
   - Good content extraction
   - HTML overhead
   - Well-preserved formatting
   - Complete metadata

3. Node-unfluff
   - Decent content
   - Formatting issues
   - Some noise
   - Good metadata

4. HTML-to-text
   - Excessive noise
   - Poor formatting
   - UI elements present
   - Not suitable for LLM

Recommendation: Use Mozilla Readability for LLM context augmentation due to its superior content cleaning and structure preservation while maintaining high signal-to-noise ratio.