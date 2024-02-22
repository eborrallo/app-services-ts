import { ElasticRepository } from '../../../../Shared/infrastructure/persistence/elasticsearch/ElasticRepository';
import { Message } from '../../domain/models/Message';
import { MessageRepository } from '../../domain/repositories/MessageRepository';

export class ElasticMessageRepositroy extends ElasticRepository<Message> implements MessageRepository {
  async save(message: Message): Promise<void> {
    return this.persist(message.id, message);
  }
}
