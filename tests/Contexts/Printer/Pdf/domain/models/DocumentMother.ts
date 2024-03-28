import { faker } from '@faker-js/faker';
import { Document, DocumentStatus } from '../../../../../../src/Contexts/Printer/Pdf/domain/models/Document';

export class DocumentMother {
  static create(id: string, name: string, content: string, status: DocumentStatus): Document {
    return new Document(id, name, content, status);
  }

  static random(id?: string, name?: string, content?: string, status?: DocumentStatus): Document {
    return this.create(
      id ?? faker.string.uuid(),
      name ?? faker.lorem.word(),
      content ?? JSON.stringify({ data: faker.lorem.word() }),
      status ?? faker.helpers.enumValue(DocumentStatus)
    );
  }
}
