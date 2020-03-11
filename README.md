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

Make sure to turn on **Less Secure App Access** from your Gmail account to be able to send notifications.

## Resources

- [Intro to puppeteer](https://developers.google.com/web/tools/puppeteer)
- [Intro to cheerio](https://github.com/cheeriojs/cheerio)
