import { JSDOM } from "jsdom";

export interface HtmlParser {
    parse: (html: string) => Promise<Document>;
}

export class BrowserHtmlParser implements HtmlParser {
    async parse(html: string): Promise<Document> {
        const parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
    }
}

export class NodeHtmlParser implements HtmlParser {
    async parse(html: string): Promise<Document> {
        const dom = new JSDOM(html);
        return dom.window.document;
    }
}