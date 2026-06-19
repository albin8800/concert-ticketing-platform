 import { Module } from '@nestjs/common';
 import { ClientsModule, Transport } from '@nestjs/microservices';
 import { join } from 'path';
 import { AuthController } from './auth/auth.controller';
 import { JwtAuthGuard } from './auth/jwt-auth.guard';
 import { AppService } from './app.service';
 import { AppController } from './app.controller';
 import { BookingController } from './booking/booking.controller';

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
         {
          name: 'BOOKING_PACKAGE',
          transport: Transport.GRPC,
          options: {
            package: 'booking',
            protoPath: join(__dirname, '../../../../proto/booking.proto'),
            url: 'localhost:3001',
            loader: { keepCase: true }
          }
         }
       ]),
     ],
     controllers: [AuthController, BookingController, AppController],
     providers: [AppService, JwtAuthGuard],
   })
   export class AppModule {}