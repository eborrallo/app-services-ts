import { CreateDocumentCommand } from './CreateDocumentCommand';
import { Command } from '../../../../Shared/domain/Command';
import { CommandHandler } from '../../../../Shared/domain/CommandHandler';
import { EventBus } from '../../../../Shared/domain/EventBus';
import { DocumentRepository } from '../../domain/repositories/DocumentRepository';
import { Document } from '../../domain/models/Document';
import { Criteria } from '../../../../Shared/domain/criteria/Criteria';
import { Filters } from '../../../../Shared/domain/criteria/Filters';
import { Filter } from '../../../../Shared/domain/criteria/Filter';
import { FilterField } from '../../../../Shared/domain/criteria/FilterField';
import { FilterOperator, Operator } from '../../../../Shared/domain/criteria/FilterOperator';
import { FilterValue } from '../../../../Shared/domain/criteria/FilterValue';
import { Order } from '../../../../Shared/domain/criteria/Order';

export class CreateDocumentCommandHandler implements CommandHandler<CreateDocumentCommand> {
  constructor(private documentRepository: DocumentRepository, private eventBus: EventBus) {
  }

  subscribedTo(): Command {
    return CreateDocumentCommand;
  }

  async handle(command: CreateDocumentCommand): Promise<void> {
    try {
      const document = new Document(command.id, command.template, JSON.stringify(command.data));
      if (!await this.documentExist(command.id)) {
        await this.documentRepository.save(document);
        await this.eventBus.publish(document.pullDomainEvents());
      }
    } catch (e) {
      console.log(e);
    }
  }

  async documentExist(id: string): Promise<boolean> {

    const criteria = new Criteria(
      new Filters([
        new Filter(
          new FilterField('id'),
          new FilterOperator(Operator.EQUAL),
          new FilterValue(id)
        )
      ]),
      Order.none()
    );
    const document = await this.documentRepository.find(criteria);
    return document !== null;
  }
}
