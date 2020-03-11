const puppeteer = require('puppeteer');
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const url =
  'https://www.amazon.com/LG-27UK850-W-Monitor-Connectivity-FreeSync/dp/B078GVTD9N/';

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

const checkPrice = async page => {
  await page.reload();
  let dollarPrice;
  try {
    // Get full page
    let html = await page.evaluate(() => document.body.innerHTML);

    // Get the DOM element with price
    $('#priceblock_ourprice', html).each(function() {
      dollarPrice = $(this).text();
    });
  } catch (error) {
    console.error(error);
  } finally {
    return dollarPrice;
  }
};

const monitor = async () => {
  let page = await configureBrowser();
  await checkPrice(page);
};

monitor();
