
export interface AuthValidation {
  verify(id: string): Promise<{ uid: string }>;
}
