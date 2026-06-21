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
    let token = null;

    // 1. Try to get token from Authorization header
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Try to get token from the HttpOnly cookie (since Next.js sends it via proxy)
    if (!token && request.headers.cookie) {
      const cookies = request.headers.cookie.split(';');
      const accessCookie = cookies.find((c: string) => c.trim().startsWith('accessToken='));
      if (accessCookie) {
        token = accessCookie.split('=')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException('No token found in header or cookie');
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
