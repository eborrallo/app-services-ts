import { ImportServers } from './ImportServers';

const serverId = '899377421617336370';
ImportServers.run(serverId)
  .then(() => {
    console.log(`Server ${serverId} importer SUCCESFULL`);
    process.exit(0);
  })
  .catch(error => {
    console.error('ERROR on import server', error);
    process.exit(1);
  });
