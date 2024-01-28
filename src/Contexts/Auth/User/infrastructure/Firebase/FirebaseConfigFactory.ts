import config from "../config";
import {FirebaseConfig} from "../../../../Shared/infrastructure/Firebase/FirebaseConfig";

export class FirebaseConfigFactory {
  static createConfig(): FirebaseConfig {
    return {
      type: config.get('firebase.type'),
      project_id: config.get('firebase.project_id'),
      private_key_id: config.get('firebase.private_key_id'),
      private_key: config.get('firebase.private_key'),
      client_email: config.get('firebase.client_email'),
      client_id: config.get('firebase.client_id'),
      auth_uri: config.get('firebase.auth_uri'),
      token_uri: config.get('firebase.token_uri'),
      auth_provider_x509_cert_url: config.get('firebase.auth_provider_x509_cert_url'),
      client_x509_cert_url: config.get('firebase.client_x509_cert_url')
    };
  }
}
