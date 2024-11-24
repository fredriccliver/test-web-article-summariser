declare module 'html-to-text' {
  export interface HtmlToTextOptions {
    wordwrap?: number | false;
    ignoreImage?: boolean;
    ignoreHref?: boolean;
    [key: string]: any;
  }
  
  export function htmlToText(html: string, options?: HtmlToTextOptions): string;
}