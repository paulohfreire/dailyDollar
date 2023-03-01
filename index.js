const puppeteer = require("puppeteer");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const fs = require("fs");

const GOOGLE_FINANCE_URL = "http://www.google.com/finance/quote/EUR-BRL";

async function getExchangeRate() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(GOOGLE_FINANCE_URL, { waitUntil: "networkidle0" });
  const exchangeRate = await page.$eval(".kf1m0", (el) => el.textContent);
  await browser.close();
  return exchangeRate;
}

async function sendMessage(message) {
  const client = new Client();
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });
  client.on("ready", async () => {
    const chatId = "5584999191072@c.us";
    await client.sendMessage(chatId, message);
    //await client.destroy();
  });
  await client.initialize();
}

async function main() {
  const exchangeRate = await getExchangeRate();
  const message = `O Euro hoje vale R$ ${exchangeRate} Reais`;
  await sendMessage(message);
}

main();
