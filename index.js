const puppeteer = require('puppeteer');
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
require('dotenv').config();

const url =
  'https://www.amazon.com/LG-27UK850-W-Monitor-Connectivity-FreeSync/dp/B078GVTD9N/';

// Setup puppeteer
const configureBrowser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url);
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

    // Get the DOM element with price
    $('#priceblock_ourprice', html).each(function() {
      const dollarPrice = $(this).text();
      currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g, ''));
    });

    if (currentPrice < 500) {
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
      user: process.env.USER,
      pass: process.env.PASS
    }
  });

  const emailBody = `Price dropped to ${price}, buy now!`;
  const htmlText = `<a href=${url}>Link</a>`;

  try {
    console.log(`Sending email...`);
    const info = await transporter.sendMail({
      from: `"Price Tracker" <${process.env.USER}>`,
      to: 'maniaxecorp@gmail.com',
      subject: 'Price drop!',
      text: emailBody,
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
