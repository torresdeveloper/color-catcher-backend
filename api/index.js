const express = require('express');
//const puppeteer = require('puppeteer');
const cors = require('cors'); 
const chromium = require('chrome-aws-lambda');

const app = express();

app.use(cors()); 

app.use(express.json());

app.get("/api" , async(req, res) => {
    res.json({
        status: "ok"
    });
});

app.post('/api/scrape', async (req, res) => {
    const siteURL = req.body.url;

    try {
        //const browser = await puppeteer.launch();
        const browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            //headless: chromium.headless,
            headless: true,
            ignoreHTTPSErrors: true,
          });
        const page = await browser.newPage();

        await page.goto(siteURL);

        const colors = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            const uniqueColors = new Set();

            elements.forEach(element => {
                const backgroundColor = getComputedStyle(element).backgroundColor;
                const color = getComputedStyle(element).color;

                if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
                    uniqueColors.add(backgroundColor);
                }

                if (color && color !== 'rgb(0, 0, 0)') {
                    uniqueColors.add(color);
                }
            });

            return Array.from(uniqueColors);
        });

        await browser.close();

        res.json({ colors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while scraping the website.' });
    }
});



module.exports = app;


