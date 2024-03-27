import { BrowserError } from '../exceptions/BrowserError';
import puppeteer, { Browser } from 'puppeteer';
import config from '../../../../Printer/Pdf/infrastructure/config';

export class WebClientFactory{
  static async client():Promise<Browser>{
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: config.get('puppeteer.ignoreHttpsErrors'),
      timeout: 60000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    browser.on('error', (err) => {
      throw new BrowserError(err);
    });

    return browser;
  }
}
