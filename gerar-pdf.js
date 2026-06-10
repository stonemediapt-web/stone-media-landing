const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const filePath = 'file:///' + path.resolve('apresentacao.html').split('\\').join('/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: 'StoneMedia_Apresentacao.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log('PDF gerado: StoneMedia_Apresentacao.pdf');
})();
