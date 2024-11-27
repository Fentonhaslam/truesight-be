import puppeteer, { Browser } from "puppeteer";
import { parseStringPromise } from "xml2js";

interface Article {
  title: string;
  summary: string;
  publishedAt?: string;
}

interface ArticleData {
  url: string;
  h1: string;
  text: string[];
}

const LANGUAGE = "en";
const LOCALE = "us";
const TIMEOUT_MS = 60000;
const NEWS_ENDPOINT = "top";

export const fetchFeedData = async (searchQuery: string): Promise<Article[]> => {
  try {
    const articleData = await searchAndScrapeNewsService(searchQuery);
    if (!articleData || articleData.length === 0) {
      console.log("No articles found for query:", searchQuery);
      return [];
    }

    return articleData.map((data) => ({
      title: data.h1 || "No Title",
      summary: data.text.slice(0, 3).join(" ") || "No summary available",
      publishedAt: undefined, // Optional field; can be set if source provides publish date
    }));
  } catch (error) {
    console.error(`Failed to fetch or scrape data for ${searchQuery}:`, error);
    return [];
  }
};

export const searchAndScrapeNewsService = async (
  searchQuery: string
): Promise<ArticleData[]> => {
  const API_KEY = process.env.NEWS_API_KEY;
  if (!API_KEY) {
    console.error("News API key not found.");
    return [];
  }
  const encodedLang = encodeURIComponent(LANGUAGE);
  const encodedLocale = encodeURIComponent(LOCALE);
  const encodedApiKey = encodeURIComponent(API_KEY);
  const encodedNewsEndpoint = encodeURIComponent(NEWS_ENDPOINT);
  const url = `https://api.thenewsapi.com/v1/news/${encodedNewsEndpoint}?locale=${encodedLocale}&language=${encodedLang}&api_token=${API_KEY}&search=${encodeURIComponent(
    searchQuery
  )}`;


  const getNewsData = async (): Promise<string[]> => {
    try {
      console.log(`Fetching news articles for query: "${searchQuery}"...`);
      console.log(`URL: ${url}`);
      console.log(`API_KEY: ${API_KEY}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error fetching news headlines.");
      }
      console.log("Response:", response);
      const body = await response.json();
      return body.data.map((article: { url: string }) => article.url);
    } catch (error) {
      console.error("Error in getNewsData:", error);
      return [];
    }
  };

  const scrapeArticles = async (urls: string[]): Promise<ArticleData[]> => {
    const browser: Browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const results: ArticleData[] = [];

    for (const url of urls) {
      try {
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: TIMEOUT_MS,
        });

        const { header, contentBlocks } = await page.evaluate(() => {
          const h1Element = document.querySelector("h1");
          const headerText = h1Element
            ? h1Element.innerText
            : "No h1 element found";

          const contentSelectors = [
            "p",
            ".article-content p",
            ".main-content p",
            ".page-content p",
            ".content-body p",
            "article p",
            "section p",
          ];

          const contentText: string[] = [];
          contentSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((element) => {
              contentText.push((element as HTMLElement).innerText);
            });
          });

          return { header: headerText, contentBlocks: contentText };
        });

        results.push({
          url,
          h1: header,
          text: contentBlocks,
        });
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        results.push({
          url,
          h1: "Error fetching H1 element",
          text: [],
        });
      }
    }
    await browser.close();
    console.log("Scraped articles:", results);
    return results;
  };

  const urls = await getNewsData();
  console.log("Found article URLs:", urls);
  if (urls.length) {
    return await scrapeArticles(urls);
  } else {
    console.log("No article URLs found");
    return [];
  }
};
