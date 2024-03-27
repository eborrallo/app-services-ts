import fs from 'fs';
import path from 'path';
import i18next from 'i18next';

export class TranslationsLoader {
  async locale(templateName: string) {
    const dir=path.join(__dirname, '..', '..', 'domain', 'templates', templateName, 'locales')
    const files = fs.readdirSync(dir);
    let resources = {};
    files.forEach((file) => {
      const language = file.split('.')[0];
      resources = {
        ...resources,
        [language]: {
          [templateName]: require(path.resolve(dir, file))
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
