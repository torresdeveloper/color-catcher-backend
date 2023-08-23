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
      // this._browser = await chromium.puppeteer.launch({
      //     args: chromium.args,
      //     defaultViewport: chromium.defaultViewport,
      //     executablePath: await chromium.executablePath,
      //     //headless: chromium.headless,
      //     headless: true,
      //     ignoreHTTPSErrors: true,
      //   });
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