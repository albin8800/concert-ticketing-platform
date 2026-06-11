 import { Module } from '@nestjs/common';
 import { ClientsModule, Transport } from '@nestjs/microservices';
 import { join } from 'path';
 import { AuthController } from './auth/auth.controller';
 import { JwtAuthGuard } from './auth/jwt-auth.guard';
 import { AppService } from './app.service';
 import { AppController } from './app.controller';

 @Module({
   imports: [
     ClientsModule.register([
       {
           name: 'AUTH_PACKAGE',
           transport: Transport.GRPC,
           options: {
             package: 'auth',
             protoPath: join(__dirname, '../../../../proto/auth.proto'),
             url: 'localhost:3003',
             loader: { keepCase: true }
           },
         },
       ]),
     ],
     controllers: [AuthController, AppController],
     providers: [AppService, JwtAuthGuard],
   })
   export class AppModule {}