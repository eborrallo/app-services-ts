import { Message } from '../models/Message';

export interface MessageRepository {
  save(entity: Message): Promise<void>;
}
