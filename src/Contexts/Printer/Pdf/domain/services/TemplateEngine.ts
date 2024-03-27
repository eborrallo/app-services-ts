export interface TemplateEngine {
  render({ templateName, language, templateArguments }: {
    templateName: string,
    language: string,
    templateArguments: any
  }): Promise<{header:string, body:string,footer:string}>;
}
