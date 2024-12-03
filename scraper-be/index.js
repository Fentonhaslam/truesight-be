import express from "express";
import scrapeArticlesController from "./controller.js";

const app = express();
app.use(express.json());
const port = 3000;

app.post("/scrape-articles", scrapeArticlesController);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
