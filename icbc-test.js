
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
//const edgePaths = require("edge-paths");
const chromePaths = require('chrome-paths');

(async () => {

  const width = 1200;
  const height = 900;

  //const EDGE_PATH = edgePaths.getEdgePath();
  const CHROME_PATH = chromePaths.chrome;

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: CHROME_PATH,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [`--window-size=${width},${height}`, '--disable-features=site-per-process']
  });

  const [page] = await browser.pages();
  await page.setViewport({ width: width, height: height - 93 });
  await page.setRequestInterception(true);

  let language = 'english';

  page.on('request', request => {
    if (request.url() === 'https://practicetest.icbc.com/components/test/controller.js') {
      request.respond({
        status: 200,
        contentType: 'application/javascript',
        body: fs.readFileSync(path.join(__dirname, 'src/mandarin/test_controller.js'), 'utf8')
      });
      return;
    } else if (request.url() === 'https://practicetest.icbc.com/components/question/view.html') {
      const customContent = fs.readFileSync(path.join(__dirname, 'src/mandarin/question_view.html'), 'utf8');
      request.respond({
        status: 200,
        contentType: 'text/xml',
        body: customContent
      });
      return;
    } else if (request.url() === 'https://practicetest.icbc.com/components/question/directive.js') {
      const customContent = fs.readFileSync(path.join(__dirname, 'src/mandarin/question_directive.js'), 'utf8');
      request.respond({
        status: 200,
        contentType: 'text/xml',
        body: customContent
      });
      return;
    } else if (request.url() === 'https://practicetest.icbc.com/components/test/view.html') {
      const customContent = fs.readFileSync(path.join(__dirname, 'src/mandarin/test_view.html'), 'utf8');
      request.respond({
        status: 200,
        contentType: 'text/xml',
        body: customContent
      });
      return;
    } else if (request.url() === 'https://practicetest.icbc.com/data/opkt/english.xml') {
      language = 'english';
    } else if (request.url() === 'https://practicetest.icbc.com/data/opkt/punjabi.xml') {
      language = 'punjabi';
    } else if (request.url() === 'https://practicetest.icbc.com/') {
      request.respond({
        status: 200,
        body: fs.readFileSync(path.join(__dirname, 'src/index.html'), 'utf8')
      });
      return;
    } else if (request.url() === 'https://practicetest.icbc.com/data/opkt/mandarin.xml') {
      language = 'mandarin';
      request.respond({
        status: 200,
        contentType: 'text/xml',
        body: fs.readFileSync(path.join(__dirname, 'data/mandarin_merged.xml'), 'utf8')
      });
      return;
    } else if (request.url() === 'https://practicetest.icbc.com/styles/style.css') {
      request.respond({
        status: 200,
        body: fs.readFileSync(path.join(__dirname, 'src/style.css'), 'utf8')
      });
      return;
    }

    request.continue();
  });

  await page.goto('https://practicetest.icbc.com/');

})();
