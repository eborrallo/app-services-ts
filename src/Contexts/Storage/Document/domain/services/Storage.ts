export interface Storage {
  upload(file: any, bucket: any): Promise<any>;

  retrieve(bucket: any, documentId: any): Promise<any>;
}
