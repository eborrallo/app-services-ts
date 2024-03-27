import path from 'path';
import fs from 'fs';
import { UnableToRenderTemplate } from '../exceptions/UnableToRenderTemplate';
import nunjucks, { Environment } from 'nunjucks';
import { encode } from 'node-base64-image';
import moment from 'moment';
import _ from 'lodash';
import { TemplateEngine } from '../../domain/services/TemplateEngine';

export class NunjucksTemplateEngine implements TemplateEngine{
  private nunjucksEnvironments: any;

  constructor(private translator: any, private templatesPath: any) {
    this.nunjucksEnvironments = {};

  }

  async render({ templateName, language, templateArguments }: any):Promise<{header:string, body:string,footer:string}> {
    const env = await this.nunjucksEnvironment(templateName, language);

    const renderOptions = { templateName, templateArguments, env };

    const data: any = {
      header: null,
      body: null,
      footer: null,
      options: null
    };
    await Promise.all([
      this.print('header.html', renderOptions).then((html) => {data.header = html;}),
      this.print('body.html', renderOptions).then((html) => {data.body = html;}),
      this.print('footer.html', renderOptions).then((html) => {data.footer = html;}),
      this.optionsFromTemplate(templateName).then((options) => {data.options = options;})
    ]);

    return data;

  }

  private async print(templateFile: any, { templateName, templateArguments, env }: any) {
    const template = path.join(this.templatesPath, templateName, templateFile);

    //TODO find it on S3 ( Storage context)
    if (!fs.existsSync(template)) {
      return '';
    }

    try {
      return await new Promise((resolve, reject) => {
        env.render(
          template,
          templateArguments,
          ((err: any, res: any) => ((err) ? reject(err) : resolve(res)))
        );
      });
    } catch (err) {
      throw new UnableToRenderTemplate({ template, previous: err });
    }
  }

  private async optionsFromTemplate(templateName:string) {
    const optionsPath = path.join(this.templatesPath, templateName, 'options.json');

    return (fs.existsSync(optionsPath) ? require(optionsPath) : {});
  }

  private async nunjucksEnvironment(templateName: string, language: string): Promise<Environment> {
    if (!this.nunjucksEnvironments[templateName]) {
      this.nunjucksEnvironments[templateName] = {};
    }

    if (!this.nunjucksEnvironments[templateName][language]) {
      const env = nunjucks.configure([this.templatesPath]);

      const translator = await this.translator.locale(templateName);
      await translator.changeLanguage(language);

      env.addFilter('t', (text, locale) => translator.t(text, { lng: locale }));

      env.addFilter('loadCss', (css, alternativeTemplateName = null) => (
        new nunjucks.runtime.SafeString(fs.readFileSync(
          path.resolve(path.join(this.templatesPath, alternativeTemplateName || templateName), 'assets/css', css),
          'utf-8'
        ))
      ));

      env.addFilter('loadJs', (js, alternativeTemplateName = null) => (
        new nunjucks.runtime.SafeString(fs.readFileSync(
          path.resolve(path.join(this.templatesPath, alternativeTemplateName || templateName), 'assets/js', js),
          'utf-8'
        ))
      ));

      env.addFilter(
        'base64Image',
        async (...args) => {
          const callback = args.pop();

          try {
            const image = args[0];
            const alternativeTemplateName = args[1] || templateName;

            const encodedImage = await this.encodeImageToBase64({
              image, templateName: alternativeTemplateName
            });

            callback(null, encodedImage);
          } catch (err) {
            callback(err);
          }
        },
        true
      );

      env.addFilter('field', (customFields:any[], name:string) => {
        if (customFields === undefined) {
          return null;
        }

        const field = customFields.filter((customField) => customField.field === name);

        if (!field.length) {
          return null;
        }

        return field.shift().value;
      });

      env.addFilter('split', (string, separator, limit) => (
        _.split(string, separator, limit)
      ));

      env.addFilter('numberFormat', (number, locale, minDecimals = 2, maxDecimals = 6) => new Intl.NumberFormat(
        locale,
        {
          style: 'decimal',
          minimumFractionDigits: minDecimals,
          maximumFractionDigits: maxDecimals
        }
      ).format(number));

      env.addFilter('currencyFormat', (
        number,
        currency,
        locale,
        displaySymbol = false,
        minDecimals = 2,
        maxDecimals = 6
      ) => {
        try {
          const formattedValue = new Intl.NumberFormat(
            locale,
            {
              style: 'currency',
              currency,
              minimumFractionDigits: minDecimals,
              maximumFractionDigits: maxDecimals
            }
          ).format(number);

          if (!displaySymbol) {
            return formattedValue.replace(currency, '').trim();
          }

          return formattedValue;
        } catch (e) {
          if (displaySymbol) {
            return `${currency} ${number}`;
          }

          return number;
        }
      });

      env.addFilter('date', (date, format, locale) => {
        const objDate = moment(date);

        if (locale) {
          objDate.locale(locale);
        }

        return objDate.format(format);
      });

      env.addFilter('percentage', (input, symbol) => {
        const symbolPercentatge = symbol || '%';
        const value = parseFloat(input);

        return value + symbolPercentatge;
      });


      this.nunjucksEnvironments[templateName][language] = env;
    }

    return this.nunjucksEnvironments[templateName][language];
  }

  private async encodeImageToBase64({ image, templateName }: { image: string, templateName: string }) {
    const imageWithPath = path.resolve(
      path.join(this.templatesPath, templateName),
      'assets/images',
      image
    );
    const encodedImage = await encode(imageWithPath, { local: true, string: true });

    let extname = path.extname(imageWithPath).substr(1) || 'png';

    if (extname === 'svg') {
      extname = 'svg+xml';
    }

    return `data:image/${extname};base64,${encodedImage}`;
  }
}
