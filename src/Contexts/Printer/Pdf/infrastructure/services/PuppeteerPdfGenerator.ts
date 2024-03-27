import Logger from '../../../../Shared/domain/Logger';
import { Browser } from 'puppeteer';
import path from 'path';
import { PdfGenerator } from '../../domain/services/PdfGenerator';
import { BrowserError } from '../exceptions/BrowserError';

export class PuppeteerPdfGenerator implements PdfGenerator {
  private path: any;

  constructor(private webClient: Promise<Browser>, private logger: Logger) {
    this.path = path;
  }

  async generate(path: string, filename: string, header: string, body: string, footer: string, options: any, correlationId: string, messageId: string
  ) {
    const filePath = this.path.join(path, filename);

    this.logger.debug(`Starting PDF generation ${correlationId} ${messageId}`);

    let page;

    try {
      page = await (await this.webClient).newPage();
    } catch (error) {
      throw new BrowserError(error);
    }

    try {
      let pageFailure;

      page.on('error', (error: any) => {
        pageFailure = new BrowserError(error);
      });

      page.on('pageerror', (error: any) => {
        pageFailure = new BrowserError(error);
      });

      page.on('requestfailed', (request: any) => {
        pageFailure = new BrowserError(request.failure().errorText);
      });

      this.logger.debug(`Setting page content ${correlationId} ${messageId}`);

      try {
        await page.setContent(body);
      } catch (error) {
        throw new BrowserError(error);
      }

      if (pageFailure) {
        throw pageFailure;
      }

      this.logger.debug(`Creating PDF ${correlationId} ${messageId}`);
      try {
        await page.pdf({
          path: filePath,
          format: 'A4',
          printBackground: true,
          displayHeaderFooter: !!(header || footer),
          headerTemplate: header || ' ', // Make sure we don't fall back to the default header/footer
          footerTemplate: footer || ' ',
          margin: options.margin
        });
      } catch (error) {
        throw new BrowserError(error);
      }

      this.logger.debug(`PDF generated into ${filePath} ${correlationId} ${messageId}`);

      return filePath;
    } finally {
      page.close().then(()=>{
      }).catch(() => {
        console.log('Failed to close page');
      });
    }
  }
}
