const scraper = require("./WebScraping");
const app = require("/app");

const PORT = process.env.PORT || 3000;

scraper
  // launch browser before starting the API server
  .getBrowser()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error launching browser: ${error}`);
    console.error(error);
    process.exit(1);
  });