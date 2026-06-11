import { Injectable, CanActivate, ExecutionContext, Inject, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private authService: any;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<any>('AuthService');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      const response = await firstValueFrom(this.authService.validateToken({ token }));
      if (response && response.valid) {
        request.user = { userId: response.userId };
        return true;
      }
      throw new UnauthorizedException('Invalid token');
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
