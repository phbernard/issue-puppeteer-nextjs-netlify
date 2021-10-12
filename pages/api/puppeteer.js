// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import chromium from 'chrome-aws-lambda';

export default function handler(req, res) {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    headless: chromium.headless
  });

  res.status(200).json({ name: 'John Doe' })
}
