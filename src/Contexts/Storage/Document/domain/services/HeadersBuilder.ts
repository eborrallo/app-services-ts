export class HeadersBuilder {
  static requiredHeaderTypes() {
    return {
      source: 'x-source',
      bucket: 'x-bucket',
      contentType: 'content-type'
    };
  }

  static optionalHeaderTypes() {
    return {
      customXmeta: 'x-meta-',
      correlationId: 'x-correlation-id',
      documentName: 'x-document-name'
    };
  }

  static customXHeaders({ headers }: { headers: any }) {
    const requiredTypes = Object.values(this.requiredHeaderTypes());
    const optionalTypes = Object.values(this.optionalHeaderTypes());

    return Object.keys(headers)
      .filter(
        h => h.startsWith(this.optionalHeaderTypes().customXmeta) || [...requiredTypes, ...optionalTypes].includes(h)
      )
      .reduce((obj: any, key: string) => {
        obj[key] = headers[key];
        return obj;
      }, {});
  }
}
