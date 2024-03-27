export interface PdfGenerator {
  generate(path: string, filename: string, header: string, body: string, footer: string, options: any, correlationId: string, messageId: string
  ): Promise<any>
}
