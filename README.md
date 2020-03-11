# price-alert

Scrape an Amazon (or others) page for a product. If price less than the threshold, send an email alert. Built using puppeteer, cheerio and nodemailer.

## Development

Make sure you have node > 9.

```
git clone https://github.com/rxhl/price-alert.git && cd price-alert
cp env .env # Fill in details
npm install
npm start
```

#### env

| Key   | Description           |
| ----- | --------------------- |
| USER  | Gmail address         |
| PASS  | Gmail password        |
| URL   | Product page url      |
| LIMIT | Price threshold (USD) |

#### Email Settings

Flock has an option to let the users reset their passwords. This uses flask-mail package which requires a valid email account. We are using Gmail here so after setting the correct values in the .env file, make sure to turn on Less secure app access from your Gmail account.
