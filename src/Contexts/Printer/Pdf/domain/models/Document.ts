import { AggregateRoot } from '../../../../Shared/domain/AggregateRoot';
import { DocumentPendingCreatedDomainEvent } from '../events/DocumentPendingCreatedDomainEvent';


export enum DocumentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Error = 'error'
}

export class Document extends AggregateRoot {


  constructor(readonly id: string, readonly name: string, readonly content: string, public status: DocumentStatus = DocumentStatus.Pending) {
    super();
    this.record(new DocumentPendingCreatedDomainEvent({ aggregateId:id, name, content }));
  }

  static fromPrimitives(plainData: Partial<Document>): Document {
    return new Document(plainData.id!, plainData.name!, plainData.content!, plainData.status!);

  }
  toPrimitives(): any {
    return {
      id: this.id,
      name: this.name,
      content: this.content,
      status: this.status
    };
  }

}
