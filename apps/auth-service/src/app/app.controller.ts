import { Controller, Logger, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { RegisterDto, LoginDto } from 'common';


@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    this.logger.log('AppController initialized. AuthService present: ' + (!!this.authService));
  }

  @GrpcMethod('AuthService', 'Register')
  register(data: RegisterDto) {
    this.logger.log('Received registration data:', JSON.stringify(data));
    return this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'Login')
  login(data: LoginDto) {
    this.logger.log('Logging in user: ' + data.email);
    return this.authService.login(data);
  }
}
