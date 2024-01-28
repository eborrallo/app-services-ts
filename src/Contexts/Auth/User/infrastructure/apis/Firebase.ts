import {app} from 'firebase-admin/lib/firebase-namespace-api';
import {Auth} from '../../domain/services/Auth';

export class Firebase implements Auth {
  private firebaseApp: app.App;

  constructor(firebaseApp: app.App) {
    this.firebaseApp = firebaseApp;
  }

  async createUser(email: string, password: string): Promise<string> {
    const auth = this.firebaseApp.auth();
    const credentials = await auth.createUser({
      email: email.toString(),
      password: password.toString()
    });
    return credentials.uid;
  }

  async user(uid: string): Promise<any> {
    const auth = this.firebaseApp.auth();
    return auth.getUser(uid);
  }

  async verify(token: string): Promise<{ uid: string }> {
    const auth = this.firebaseApp.auth();
    try {
      return auth.verifyIdToken(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async deleteUser(email: string): Promise<void> {
    const auth = this.firebaseApp.auth();

    const user = await auth.getUserByEmail(email);
    return auth.deleteUser(user.uid);
  }
}
