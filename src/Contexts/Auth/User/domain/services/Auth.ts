import {AuthValidation} from "./AuthValidation";

export interface Auth extends AuthValidation {
  createUser(email: string, password: string): Promise<string>;
  deleteUser(email: string): Promise<void>;
  user(id: string): Promise<any>;
}
