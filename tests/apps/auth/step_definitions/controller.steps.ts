import assert from 'assert';
import request from 'supertest';
import { Given, Then } from '@cucumber/cucumber';
import { BlockchainUser } from '../../../../src/Contexts/Auth/User/domain/models/BlockchainUser';
import { JwtGenerator } from '../../../../src/Contexts/Auth/User/domain/services/JwtGenerator';
import { expect } from 'chai';
import { UserRepository } from '../../../../src/Contexts/Auth/User/domain/repositories/UserRepository';
import { application } from './hooks.steps';
import container from "../../../../src/apps/auth/rest/dependency-injection";

let _request: request.Test;
let _response: request.Response;
let authToken: string;
Given('User {string} logged', async address => {
  const repository = container.get('Repository.UserRepository') as UserRepository;
  const user = BlockchainUser.fromPrimitives({
    address: address,
    message: 'test message'
  });
  await repository.save(user);
  authToken = 'Bearer ' + new JwtGenerator().generate(address);
});
Given('I send a GET request to {string}', (route: string) => {
  _request = request(application.httpServer).get(route);
  if (authToken) {
    _request = _request.set({ Authorization: authToken });
  }
});

Given('I send a POST request to {string} with body:', (route: string, body: string) => {
  _request = request(application.httpServer).post(route);
  if (authToken) {
    _request = _request.set({ Authorization: authToken });
  }
  _request = _request.send(JSON.parse(body));
});

Then('the response status code should be {int}', async (status: number) => {
  _response = await _request.expect(status);
});

Then('the response should be empty', () => {
  assert.deepStrictEqual(_response.body, {});
});

Then('the response content should be:', response => {
  assert.deepStrictEqual(_response.body, JSON.parse(response));
});
Then('the response content should be like:', response => {
  expect(JSON.parse(response)).to.contains(_response.body);
});
Then('the response content should be similar:', expectedResult => {
  const expected = JSON.parse(expectedResult);
  const check = (_expected: any, response: any) => {
    Object.keys(_expected).forEach(function (key) {
      if (typeof _expected[key] === 'object') {
        check(_expected[key], response[key]);
      } else if (Array.isArray(_expected[key])) {
        check({ ..._expected[key] }, { ...response[key] });
      } else {
        if (_expected[key] !== 'any') {
          expect(response[key]).to.equal(_expected[key]);
        } else {
          expect(key in response).to.be.true;
        }
      }
    });
  };
  check(expected, _response.body);
});
