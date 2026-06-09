 import { Module } from '@nestjs/common';
 import { ClientsModule, Transport } from '@nestjs/microservices';
 import { join } from 'path';
 import { AuthController } from './auth/auth.controller'; // We will create this next

 @Module({
   imports: [
     ClientsModule.register([
       {
           name: 'AUTH_PACKAGE', // The name we use to inject the client
           transport: Transport.GRPC,
           options: {
             package: 'auth',
             protoPath: join(__dirname, '../../../../proto/auth.proto'),
             url: 'localhost:3003', // Port of our Auth Service
             loader: { keepCase: true }
           },
         },
       ]),
     ],
     controllers: [AuthController],
     providers: [],
   })
   export class AppModule {}