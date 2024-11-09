import puppeteer, { Browser } from "puppeteer";

const API_KEY = "";
const LANGUAGE = "en";
const LOCALE = "us";
const TIMEOUT_MS = 60000;
const NEWS_ENDPOINT = "top";

interface ArticleData {
  url: string;
  h1: string;
  text: string[];
}

export const searchAndScrapeNewsService = async (
  searchQuery: string
): Promise<ArticleData[] | void> => {
  const encodedLang = encodeURIComponent(LANGUAGE);
  const encodedLocale = encodeURIComponent(LOCALE);
  const encodedApiKey = encodeURIComponent(API_KEY);
  const encodedNewsEndpoint = encodeURIComponent(NEWS_ENDPOINT);
  const url = `https://api.thenewsapi.com/v1/news/${encodedNewsEndpoint}?locale=${encodedLocale}&language=${encodedLang}&api_token=${encodedApiKey}&search=${encodeURIComponent(
    searchQuery
  )}`;

  // console.log(`Fetching news articles for query: "${searchQuery}"...`);

  const getNewsData = async (): Promise<string[]> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error fetching news headlines.");
      }
      const body = await response.json();
      const articleUrls = body.data.map(
        (article: { url: string }) => article.url
      );
      // console.log(`Found ${articleUrls.length} articles.`);
      return articleUrls;
    } catch (error) {
      console.error("Error in getNewsData:", error);
      return [];
    }
  };

  const scrapeArticles = async (urls: string[]): Promise<ArticleData[]> => {
    const browser: Browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const results: ArticleData[] = [];

    for (let url of urls) {
      // console.log(`Scraping URL: ${url}`);
      try {
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: TIMEOUT_MS,
        });

        // Wait for the main content elements to load
        await page
          .waitForSelector("h1", { timeout: 10000 })
          .catch(() => console.log("No h1 element found."));
        await page
          .waitForSelector(
            "p, .article-content, .main-content, .page-content, .content-body, article, section",
            {
              timeout: 10000,
            }
          )
          .catch(() => console.log("No content elements found."));

        // Scrape the header and main text
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

          let contentText: string[] = [];

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
        // console.log(`Scraped header: ${header}`);
        // console.log(`Found ${contentBlocks.length} content blocks.`);
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
    return results;
  };

  const urls = await getNewsData();
  // console.dir({ urls }, { depth: null });

  if (urls.length) {
    const scrapeResults = await scrapeArticles(urls);
    // console.dir(scrapeResults, { depth: null });
    return scrapeResults;
  } else {
    console.log("No article URLs found");
  }
};
