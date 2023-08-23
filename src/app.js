const express = require("express");
const cors = require("cors");
const scraper = require("./WebScraping");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", async (req, res) => {
  res.json({
    status: "ok",
  });
});

app.post("/api/scrape", async (req, res) => {
  const siteURL = req.body.url;

  if (!siteURL) {
    res.status(400).json({
      error: "Please provide a URL to scrape",
    });
    return;
  }

  try {
    const browser = await scraper.getBrowser();
    const page = await browser.newPage();

    await page.goto(siteURL);

    const colors = await page.evaluate(() => {
      const elements = document.querySelectorAll("*");
      const uniqueColors = new Set();

      elements.forEach((element) => {
        const backgroundColor = getComputedStyle(element).backgroundColor;
        const color = getComputedStyle(element).color;

        if (
          backgroundColor &&
          backgroundColor !== "rgba(0, 0, 0, 0)" &&
          backgroundColor !== "transparent"
        ) {
          uniqueColors.add(backgroundColor);
        }

        if (color && color !== "rgb(0, 0, 0)") {
          uniqueColors.add(color);
        }
      });

      return Array.from(uniqueColors);
    });

    await page.close();

    res.json({ colors });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `An error occurred while scraping the website: ${error}`,
    });
  }
});

module.exports = app;