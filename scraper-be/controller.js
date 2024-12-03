import searchAndScrapeNewsService from "./newsapi.js";

const scrapeArticlesController = async (req, res) => {
  const { searchQuery } = req.body;
  if (!searchQuery) {
    return res.status(400).json({ message: "No search query", data: [] });
  }
  const serviceRes = await searchAndScrapeNewsService(searchQuery);
  res.status(200).json({ message: "success", data: serviceRes });
};
export default scrapeArticlesController;
