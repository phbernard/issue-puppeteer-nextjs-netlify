import chromium from 'chrome-aws-lambda';
import tmp from 'tmp-promise';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    headless: chromium.headless
  });

  const file = await tmp.file();
  await fs.writeFile(file.path, 'Hello world');

  const page = await browser.newPage();
  await page.goto(`file:///${file.path}`, {waitUntil: [
    'networkidle0', 'domcontentloaded', 'load'
  ]});
  const image = await page.screenshot({
    type: 'jpeg'
  });

  await browser.close();

  var img = Buffer.from(image, 'base64');

  res.status(200).setHeader('Content-Type', 'image/jpg').end(img);
}
