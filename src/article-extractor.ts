import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import { encode } from 'gpt-tokenizer';

interface ArticleContent {
  title: string;
  publishDate: string | null;
  author: string | null;
  summary: string;
  content: string;
  tokens: number;
}

export class ArticleExtractor {
  private async fetchPage(url: string): Promise<Document> {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html, {
      url,
      features: { runScripts: "outside-only" }
    });
    return dom.window.document;
  }

  async extract(url: string): Promise<ArticleContent> {
    const doc = await this.fetchPage(url);
    const reader = new Readability(doc, {
      charThreshold: 500,
      nbTopCandidates: 5,
      weightClasses: true
    });

    const article = reader.parse();
    if (!article) {
      throw new Error('Failed to extract article content');
    }

    const publishDate = this.extractDate(doc);
    const author = article.byline || this.extractAuthor(doc);
    const summary = this.extractSummary(doc, article);
    const content = this.formatContent(article.content || '');
    const tokens = encode(content).length;

    return {
      title: article.title || 'Untitled',
      publishDate,
      author,
      summary,
      content,
      tokens
    };
  }

  private extractDate(doc: Document): string | null {
    const dateSelectors = [
      'meta[property="article:published_time"]',
      'meta[name="publication-date"]',
      'time[datetime]',
      'meta[name="date"]'
    ];

    for (const selector of dateSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const date = element.getAttribute('content') || element.getAttribute('datetime');
        if (date) return new Date(date).toISOString().split('T')[0];
      }
    }
    return null;
  }

  private extractAuthor(doc: Document): string | null {
    const authorSelectors = [
      'meta[name="author"]',
      'meta[property="article:author"]',
      '.author',
      '[rel="author"]'
    ];

    for (const selector of authorSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        return element.getAttribute('content') || element.textContent || null;
      }
    }
    return null;
  }

  private extractSummary(doc: Document, article: Readability.ParseResult): string {
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                    doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
    if (metaDesc) return metaDesc;

    if (article.excerpt) return article.excerpt;

    const firstPara = doc.querySelector('article p, .article p, .content p')?.textContent;
    return firstPara || '';
  }

  private formatContent(html: string): string {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const sections: string[] = [];
    let currentSection = '';

    doc.body.childNodes.forEach((node) => {
      if (node.nodeName.match(/^H[1-6]$/)) {
        if (currentSection) sections.push(currentSection.trim());
        currentSection = `## ${node.textContent}\n\n`;
      } else if (node.textContent?.trim()) {
        currentSection += node.textContent.trim() + '\n\n';
      }
    });

    if (currentSection) sections.push(currentSection.trim());
    return sections.join('\n');
  }

  async toMarkdown(url: string): Promise<string> {
    const article = await this.extract(url);
    
    return `# ${article.title}

${article.summary ? `> ${article.summary}\n\n` : ''}${article.publishDate ? `**Published:** ${article.publishDate}\n` : ''}${article.author ? `**Author:** ${article.author}\n` : ''}
---

${article.content}

---
*Total tokens: ${article.tokens}*`;
  }
}

// Add main execution code
if (import.meta.main) {
  const url = Deno.args[0];
  if (!url) {
    console.error('Please provide a URL as argument');
    Deno.exit(1);
  }

  try {
    const extractor = new ArticleExtractor();
    const markdown = await extractor.toMarkdown(url);
    const fileName = `article-${new Date().toISOString().replace(/[:.]/g, '-')}.md`;
    await Deno.writeTextFile(fileName, markdown);
    console.log(`Article extracted to: ${fileName}`);
  } catch (error) {
    console.error('Error:', error.message);
    Deno.exit(1);
  }
}