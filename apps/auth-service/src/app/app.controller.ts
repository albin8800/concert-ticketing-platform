import { Controller, Logger, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { RegisterDto, LoginDto, RefreshDto } from 'common';


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

  @GrpcMethod('AuthService', 'Refresh')
  refresh(data: RefreshDto) {
    this.logger.log('Refreshing token');
    return this.authService.refresh(data);
  }

  @GrpcMethod('AuthService', 'Logout')
  logout(data: RefreshDto) {
    this.logger.log('Logging out');
    return this.authService.logout(data);
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  validateToken(data: { token: string }) {
    this.logger.log('Validating token');
    return this.authService.validateToken(data);
  }
}
