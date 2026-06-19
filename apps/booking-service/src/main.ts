import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  // Create a NestJS Microservice (NOT a standard HTTP app)
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'booking',
        // Make sure this points to your proto file
        protoPath: join(__dirname, '../../../proto/booking.proto'),
        url: 'localhost:3001', // Listen for gRPC on 3001
        loader: { keepCase: true }
      },
    },
  );

  await app.listen();
  Logger.log('🚀 Booking Microservice is listening via gRPC on localhost:3001');
}

bootstrap();
