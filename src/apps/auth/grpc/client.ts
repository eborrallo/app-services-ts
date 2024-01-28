import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { BoolValue } from './proto/build/google/protobuf/BoolValue';
import { ProtoGrpcType } from './proto/build/auth';

const port = 3000;
const uri = `127.0.0.1:${port}`;
const PROTO_PATH = __dirname + '/proto/auth.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const client = new proto.users.Auth(uri, grpc.credentials.createInsecure());

const deadline = new Date();
deadline.setSeconds(deadline.getSeconds() + 5);
client.waitForReady(deadline, (error?: Error) => {
  if (error) {
    console.log(`Client connect error: ${error.message}`);
  } else {
    doUnaryCall();
  }
});

function doUnaryCall() {
  client.Verify(
    {
      hash: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.KR6E66BRVk1j8i15Fb-fzC2TvwpW7KaVecszgW43l-w'
    },
    (error?: grpc.ServiceError | null, serverMessage?: BoolValue) => {
      if (error) {
        console.error(error.message);
      } else if (serverMessage) {
        console.log(`(client) Got server message: ${serverMessage.value}`);
      }
    }
  );
}
