import {
  NunjucksTemplateEngine
} from '../../../../../src/Contexts/Printer/Pdf/infrastructure/services/NunjucksTemplateEngine';
import { TranslationsLoader } from '../../../../../src/Contexts/Printer/Pdf/infrastructure/services/TranslationsLoader';
import path from 'path';

test('Render should work when valid parameters are given', async () => {
  const translator = new TranslationsLoader();
  const templatesPath = path.resolve(path.join(__dirname, '..', '..', '..', '..', '..', 'src', 'Contexts', 'Printer', 'Pdf', 'domain', 'templates'));
  const sut = new NunjucksTemplateEngine(translator, templatesPath);
  const result = await sut.render(
    {
      templateName: 'test',
      language: 'es',
      templateArguments: { arg1: 'thisIsArgument1' }
    }
  );
  expect(result.header.indexOf('class="logo"') > -1).toBeTruthy();
  expect(result.body.indexOf('thisIsArgument1') > -1).toBeTruthy();
  expect(result.footer.indexOf('random data') > -1).toBeTruthy();
  expect(result.footer.indexOf('Mandarina') > -1).toBeTruthy();
});
