import * as admin from 'firebase-admin';
import { app } from 'firebase-admin/lib/firebase-namespace-api';
import { mock } from 'ts-mockito';

export class FirebaseClientFactory {
  static createClient(config: admin.ServiceAccount): app.App | undefined {
    try {
      const connection = admin.initializeApp({
        credential: admin.credential.cert(config)
      });
      return connection;
    } catch (error) {
      console.error('ERROR', error);
    }
  }
  static mockClient(): app.App {
    return mock<app.App>();
  }
}
