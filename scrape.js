const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors'); // Importe o módulo cors

const app = express();

app.use(cors()); // gio afonso

app.use(express.json());

app.get("/" , async(req, res) => {
    res.json({
        status: "ok"
    });
});

app.post('/scrape', async (req, res) => {
    const siteURL = req.body.url;

    try {
        const browser = await puppeteer.launch();
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
