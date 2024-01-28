import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { AuthServices } from './services/AuthServices';
import container from './dependency-injection';

const server = new Server();

const port = 3000;
const uri = `127.0.0.1:${port}`;
const PROTO_PATH = __dirname + '/proto/auth.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const users = loadPackageDefinition(packageDefinition).users;
// @ts-ignore
server.addService(users.Auth.service, container.get('AuthServices') as AuthServices);

server.bindAsync(uri, ServerCredentials.createInsecure(), (err, _port) => {
  if (err) {
    console.log(err);
  }
  console.log(`GRPC Server Listening on ${uri}`);
  server.start();
});
