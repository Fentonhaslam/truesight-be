import puppeteer from "puppeteer";
import fetch from "node-fetch";

const API_KEY = "EdWUBshrbnhNE8tRHptCJCD4iL4TzbygqF0W7IBm";
const LANGUAGE = "en";
const LOCALE = "us";
const TIMEOUT_MS = 60000;
const NEWS_ENDPOINT = "all";
const MAX_RETRIES = 3; // Retry attempts for failed scrapes
const DELAY_MS = 2000; // Delay between scraping articles to prevent server blocking

const searchAndScrapeNewsService = async (searchQuery) => {
  const encodedLang = encodeURIComponent(LANGUAGE);
  const encodedLocale = encodeURIComponent(LOCALE);
  const encodedApiKey = encodeURIComponent(API_KEY);
  const encodedNewsEndpoint = encodeURIComponent(NEWS_ENDPOINT);
  const url = `https://api.thenewsapi.com/v1/news/${encodedNewsEndpoint}?locale=${encodedLocale}&language=${encodedLang}&api_token=${encodedApiKey}&search=${encodeURIComponent(
    searchQuery
  )}`;

  // Function to fetch article URLs
  const getNewsData = async () => {
    console.log("Fetching article URLs...");
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Failed to fetch article URLs:", response.statusText);
        return { message: "Error fetching articles", status: 500, data: [] };
      }
      const body = await response.json();
      const articleUrls = body.data.map((article) => article.url);
      console.log(`Fetched ${articleUrls.length} article URLs.`);
      return { message: "success", status: 200, data: articleUrls };
    } catch (error) {
      console.error("Error in getNewsData:", error.message);
      return { message: "Error fetching articles", status: 500, data: [] };
    }
  };

  // Function to scrape a single article
  const scrapeArticle = async (page, url) => {
    console.log(`Scraping article: ${url}`);
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: TIMEOUT_MS,
        });

        // Selectors for h1 and content
        const h1Selector = "h1";
        const contentSelectors = [
          "p",
          ".article-content p",
          ".main-content p",
          ".page-content p",
          ".content-body p",
          "article p",
          "section p",
        ];

        // Evaluate content from the page
        const { header, contentBlocks } = await page.evaluate(
          (h1Selector, contentSelectors) => {
            const h1Element = document.querySelector(h1Selector);
            const headerText = h1Element
              ? h1Element.innerText
              : "No h1 element found";

            let contentText = [];
            contentSelectors.forEach((selector) => {
              document.querySelectorAll(selector).forEach((element) => {
                contentText.push(element.innerText);
              });
            });

            return { header: headerText, contentBlocks: contentText };
          },
          h1Selector,
          contentSelectors
        );

        console.log(`Scraped article: ${url} (Attempt: ${attempt})`);
        return {
          url,
          h1: header,
          text: contentBlocks,
        };
      } catch (error) {
        console.error(
          `Error scraping article: ${url} (Attempt: ${attempt})`,
          error.message
        );
        if (attempt === MAX_RETRIES) {
          console.error(
            `Failed to scrape article after ${MAX_RETRIES} attempts.`
          );
          return {
            url,
            h1: "Error fetching H1 element",
            text: [],
          };
        }
      }
    }
  };

  // Function to scrape all articles
  const scrapeArticles = async (urls) => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const results = [];

    for (const url of urls) {
      const result = await scrapeArticle(page, url);
      results.push(result);
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS)); // Delay between scrapes
    }

    await browser.close();
    console.log("Browser closed.");
    return results;
  };

  // Main flow
  const newsData = await getNewsData();
  if (newsData.status !== 200 || newsData.data.length === 0) {
    console.log("No articles found to scrape.");
    return { message: "No articles found", status: 404, data: [] };
  }

  const scrapeResults = await scrapeArticles(newsData.data);
  return { message: "success", status: 200, data: scrapeResults };
};

export default searchAndScrapeNewsService;
