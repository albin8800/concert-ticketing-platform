 import { Module } from '@nestjs/common';
 import { ConfigModule, ConfigService } from '@nestjs/config';
 import { JwtModule } from '@nestjs/jwt';
 import { AppController } from './app.controller';
 import { AuthService } from './auth.service';
 import { PrismaService } from './prisma.service';

 @Module({
   imports: [
       // Load .env file and make it available globally
       ConfigModule.forRoot({
         isGlobal: true,
       }),
  
       // Setup JWT asynchronously to use ConfigService
       JwtModule.registerAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory: async (configService: ConfigService) => ({
           secret: configService.get<string>('JWT_SECRET'),
           signOptions: {
             expiresIn: configService.get<any>('JWT_EXPIRES_IN', '1h')
           },
         }),
       }),
     ],
     controllers: [AppController],
     providers: [AuthService, PrismaService],
   })
   export class AppModule {}