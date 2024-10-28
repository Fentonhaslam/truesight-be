import axios from 'axios';
import { parseStringPromise } from 'xml2js';

interface Article {
  title: string;
  summary: string;
  publishedAt?: string;
}

export const fetchFeedData = async (source: string): Promise<Article[]> => {
  const feedUrl = getFeedUrl(source);
  try {
    const response = await axios.get(feedUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const parsedData = await parseStringPromise(response.data);
    return parseArticlesFromFeed(parsedData, source);
  } catch (error) {
    console.error(`Failed to fetch data from ${source}:`, error);
    return [];
  }
};

const getFeedUrl = (source: string): string => {
  switch (source.toLowerCase()) {
    case 'bbc':
      return 'https://feeds.bbci.co.uk/news/rss.xml';
    case 'financial times':
      return 'https://www.ft.com/?format=rss';
    case 'bloomberg':
      return 'https://www.bloomberg.com/feed/podcast/news.xml';
    case 'google':
      return 'https://news.google.com/rss';
    default:
      throw new Error(`Unsupported source: ${source}`);
  }
};

const parseArticlesFromFeed = (data: any, source: string): Article[] => {
  const articles: Article[] = [];
  const items = data.rss?.channel?.[0]?.item || []; // Adjust path for each source if needed

  items.forEach((item: any) => {
    const title = item.title?.[0] || 'No title';
    const summary = item.description?.[0] || 'No summary available';
    const publishedAt = item.pubDate?.[0] ? new Date(item.pubDate[0]).toISOString() : undefined;

    articles.push({ title, summary, publishedAt });
  });
  
  return articles;
};
