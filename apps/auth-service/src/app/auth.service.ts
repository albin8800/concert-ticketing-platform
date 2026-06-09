import { Injectable, Logger, Inject } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { GenerateTokenDto, LoginDto, RegisterDto } from "common";


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {
    this.logger.log('AuthService initialized');
  }

  async register(data:RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try{
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          passwordHash: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          dateOfBirth: new Date(data.dateOfBirth)
        },
         
      });
      return { message: 'User registered successfully', userId: user.id };
      
    } catch(error) {
      return { error: 'User with this email already exists' };
    }
  }

  async login(data:LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email }});
    if(user && await bcrypt.compare(data.password, user.passwordHash)) {
      return { message: 'Login successful', userId: user.id, accessToken: this.generateToken({ userId: user.id }) };
    }
    return { error: 'Invalid email or password' };
  }

  private generateToken(data: GenerateTokenDto) {
    return this.jwtService.sign({ sub: data.userId });
  }
}