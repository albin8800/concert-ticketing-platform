import { Body, Controller, Inject, OnModuleInit, Post, Res } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { LoginDto, RefreshDto, RegisterDto } from "common";
import { Response } from "express";
import { lastValueFrom } from "rxjs";


interface AuthServiceClient {
    register(data: RegisterDto): any;
    login(data: LoginDto) : any;
    refresh(data: RefreshDto) : any;
    logout(data: RefreshDto) : any;
    validateToken(data: { token: string }): any;
}

@Controller('auth')
export class AuthController implements OnModuleInit {
    private authService: AuthServiceClient;

    constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.authService = this.client.getService<AuthServiceClient>('AuthService');
    }

    @Post('register')
    register(@Body() data: RegisterDto) {
        return this.authService.register(data);
    }

    @Post('login')
    async login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
        const response = await lastValueFrom(this.authService.login(data));
        if (response.accessToken) {
            res.cookie('accessToken', response.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
        }
        return response;
    }

    @Post('refresh')
    refresh(@Body() data: RefreshDto) {
        return this.authService.refresh(data);
    }

    @Post('logout')
    logout(@Body() data: RefreshDto) {
        return this.authService.logout(data);
    }

}