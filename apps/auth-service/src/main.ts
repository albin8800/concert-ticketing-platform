 import 'dotenv/config';
 import { NestFactory } from '@nestjs/core';
 import { MicroserviceOptions, Transport } from '@nestjs/microservices';
 import { join } from 'path';
 import { AppModule } from './app/app.module';

 async function bootstrap() {
   const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
     transport: Transport.GRPC,
     options: {
         package: 'auth',
         protoPath: join(__dirname, '../../../proto/auth.proto'),
         url: '0.0.0.0:3003',
         loader: { keepCase: true }
     },
   });
  
     await app.listen();
     console.log('🔐 Auth Microservice is running on port 3003');
   }
  
   bootstrap();