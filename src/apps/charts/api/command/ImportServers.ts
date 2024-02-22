import { InitImportCommand } from '../../../../Contexts/Inbound/Discord/application/InitImportCommand';
import { InitImportCommandHandler } from '../../../../Contexts/Inbound/Discord/application/InitImportCommandHandler';
import container from '../dependency-injection';

export class ImportServers {
  static async run(serverId: string) {
    try {
      const handler = container.get<InitImportCommandHandler>('InitImportCommandHandler');
      await handler.handle(new InitImportCommand(serverId));
    } catch (e: any) {
      console.error(e);
    }
  }
}
