import fs from 'fs';
import path from 'path';
import i18next from 'i18next';

export class TranslationsLoader {
  async locale(templateName: string) {
    const files = fs.readdirSync(path.join('client/templates/', templateName, '/locales'));
    let resources = {};
    files.forEach((file) => {
      const language = file.split('.')[0];
      resources = {
        ...resources,
        [language]: {
          [templateName]: require(path.resolve('client', 'templates', templateName, 'locales', file))
        }
      };
    });


    return i18next.createInstance({
      resources,
      defaultNS: templateName
    }, (error) => {
      if (error) {
        throw error;
      }
    });
  }
}
