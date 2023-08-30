const puppeteer = require("puppeteer");

class WebScraping {
  constructor() {
    this._browser = null;
  }

  async getBrowser() {
    if (!this._browser) {
      this._browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
    return this._browser;
  }

  async closeBrowser() {
    if (this._browser) {
      await this._browser.close();
    }
  }
}

const scraper = new WebScraping();

module.exports = scraper;
