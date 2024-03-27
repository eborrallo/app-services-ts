import { CreateDocumentCommand } from './CreateDocumentCommand';
import { Command } from '../../../../Shared/domain/Command';
import { CommandHandler } from '../../../../Shared/domain/CommandHandler';
import { EventBus } from '../../../../Shared/domain/EventBus';
import { DocumentRepository } from '../../domain/repositories/DocumentRepository';
import { Document } from '../../domain/models/Document';

export class CreateDocumentCommandHandler implements CommandHandler<CreateDocumentCommand> {
  constructor(private documentRepository: DocumentRepository, private eventBus: EventBus) {
  }

  subscribedTo(): Command {
    return CreateDocumentCommand;
  }

  async handle(command: CreateDocumentCommand): Promise<void> {
    try {
      const document = new Document(command.id, command.template, JSON.stringify(command.data));
      await this.documentRepository.save(document);
      await this.eventBus.publish(document.pullDomainEvents());
    } catch (e) {
      console.log(e);
    }
  }
}
