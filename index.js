const puppeteer = require('puppeteer');
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
require('dotenv').config();

// CONSTANTS
const URL = process.env.URL; // Amazon product
const DOM_ELEM = '#priceblock_ourprice'; // DOM element with price tag, modify as needed
const SENDER_EMAIL = process.env.USER;
const SENDER_PASS = process.env.PASS;
const LIMIT = process.env.LIMIT; // Price threshold (in USD)

// Setup puppeteer
const configureBrowser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(URL);
  } catch (error) {
    console.error(error);
  } finally {
    return page;
  }
};

// Scrape page
const checkPrice = async page => {
  await page.reload();
  let currentPrice;
  try {
    // Get full page
    let html = await page.evaluate(() => document.body.innerHTML);

    $(DOM_ELEM, html).each(function() {
      const dollarPrice = $(this).text();
      currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g, ''));
    });

    //  Check if price less than threshold
    if (currentPrice < LIMIT) {
      console.log(`Time to buy! Current price: ${currentPrice}`);
      sendNotifiacation(currentPrice);
    }
  } catch (error) {
    console.error(error);
  } finally {
    return currentPrice;
  }
};

// Cron job
const startTracking = async () => {
  const page = await configureBrowser();

  // Check price every 15s, modify as needed
  const job = new CronJob(
    '*/15 * * * * *',
    () => {
      console.log(`Checking price at ${new Date().toISOString()}...`);
      checkPrice(page);
    },
    null,
    true,
    null,
    null,
    true
  );
  job.start();
};

// Setup email
const sendNotifiacation = async price => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASS
    }
  });

  const htmlText = `Price dropped to ${price}, buy now! <br/> <a href=${URL}>Link</a>`;

  try {
    console.log(`Sending email...`);
    const info = await transporter.sendMail({
      from: `"Price Tracker" <${process.env.USER}>`,
      to: 'example@example.com',
      subject: 'Price drop!',
      html: htmlText
    });
    console.log(`Email sent to ${info.messageId}! Exiting process...`);
  } catch (error) {
    console.error(error);
  } finally {
    console.log('Exiting the process...');
    process.exit(0);
  }
};

// Driver function
startTracking();
