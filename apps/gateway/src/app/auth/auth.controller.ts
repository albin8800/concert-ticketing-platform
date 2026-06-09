import { Body, Controller, Inject, OnModuleInit, Post } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { LoginDto, RegisterDto } from "common";


interface AuthServiceClient {
    register(data: RegisterDto): any;
    login(data: LoginDto) : any;
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
    login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }

}