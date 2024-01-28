import assert from 'assert';
import { Given, Then } from '@cucumber/cucumber';
import axios from 'axios';
import * as fs from 'fs';

let _response: any;

Given('I upload a file {string} :', async (filename: string, headers: string) => {
  const fileLocation = `${__dirname}/files/${filename}`;

  const upload = await axios.post('http://localhost:3000/storage/upload', fs.createReadStream(fileLocation), {
    headers: JSON.parse(headers)
  });
  _response = upload;
  assert.equal(upload.status, 201);
});
Then('I fetch the document', async () => {
  _response = await axios.get(`http://localhost:3000/storage/retrieve/${_response.data.id}`, {
    responseType: 'arraybuffer'
  });
});
Then('the response status code should be {int}', async (status: number) => {
  assert.equal(_response.status, status);
});

Then('the uploaded file should be the same as the downloaded file', async () => {
  const desiredFilePath = `${__dirname}/files/actual.png`;
  const fileLocation = `${__dirname}/files/example.png`;

  fs.writeFileSync(desiredFilePath, _response.data);
  assert.deepStrictEqual(fs.readFileSync(fileLocation).toJSON(), fs.readFileSync(desiredFilePath).toJSON());
  fs.unlinkSync(desiredFilePath);
});
Then('the response content should be:', response => {
  assert.deepStrictEqual(_response.data, JSON.parse(response));
});
