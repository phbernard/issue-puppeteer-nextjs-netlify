import chromium from 'chrome-aws-lambda';
import tmp from 'tmp-promise';
import fs from 'fs/promises';

export default async function handler(req, res) {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    headless: chromium.headless
  });

  const file = await tmp.file();
  await fs.writeFile(file, '<html><body><h1>Hello world!</h1></body></html>');

  const page = await browser.newPage();
  // Wait until there are no network connexion for 500ms
  await page.goto(`file:///${file}`, {waitUntil: [
    'networkidle0', 'domcontentloaded', 'load'
  ]});
  const image = await page.screenshot({
    type: 'jpeg'
  });

  await browser.close();

  var img = Buffer.from(image, 'base64');

  res.status(200).setHeader('Content-Type', 'image/jpg').end(img);
}
