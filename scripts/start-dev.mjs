import concurrently from 'concurrently';

 const { result } = concurrently(
   [
     { command: 'npm run start:gateway', name: 'GATEWAY', prefixColor: 'cyan' },
     { command: 'npm run start:auth', name: 'AUTH', prefixColor: 'magenta' },
     { command: 'npm run start:booking', name: 'BOOKING', prefixColor: 'yellow' },
   ],
   {
        prefix: 'name',
        killOthers: ['failure', 'success'],
        restartDelay: 1000,
      }
    );
   
    result.then(
      () => console.log('All services exited successfully'),
      (err) => console.error('One or more services failed', err)
    );