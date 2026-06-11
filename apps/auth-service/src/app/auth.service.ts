import { Injectable, Logger, Inject } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { CreateRefreshTokenDto, GenerateTokenDto, LoginDto, RefreshDto, RegisterDto } from "common";
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {
    this.logger.log('AuthService initialized');
  }

  // User registration
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

  // User login
  async login(data:LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email }});
    if(user && await bcrypt.compare(data.password, user.passwordHash)) {
      const accessToken = this.generateToken({ userId: user.id });
      const refreshToken = await this.createRefreshToken({ userId: user.id });

      return {
        message: 'Login successful',
        userId: user.id,
        accessToken,
        refreshToken,
      }
    }
    return { error: 'Invalid email or password' };
  }

  // Generate JWT access token
  private generateToken(data: GenerateTokenDto) {
    return this.jwtService.sign({ sub: data.userId });
  }

  // Refresh access token using refresh token
  async refresh(data: RefreshDto) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: data.refreshToken },
      include: { user: true },
    });

    if(!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      return { error: 'Invalid or expired refresh token' };
    }

    // Revoke the used token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true }
    });

    const accessToken = this.generateToken({ userId: storedToken.userId });
    const newRefreshToken = await this.createRefreshToken({ userId: storedToken.userId });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      userId: storedToken.userId
    }
  }

  // Logout by revoking the refresh token
  async logout(data: RefreshDto) {
    try {
      await this.prisma.refreshToken.update({
        where: { token: data.refreshToken },
        data: { revoked: true }
      });
      return { message: 'Logged out successfully' };
    } catch (error) {
      return { error: 'Invalid token' };
    }
  }

  // Validate JWT token
  async validateToken(data: { token: string }) {
    try {
      const payload = this.jwtService.verify(data.token);
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        return { valid: false, userId: '' };
      }
      return { valid: true, userId: payload.sub };
    } catch (error) {
      return { valid: false, userId: '' };
    }
  }

  // Create a new refresh token for a user
  private async createRefreshToken(data: CreateRefreshTokenDto) {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId: data.userId,
        expiresAt,
      }
    });
    return token;
  }
}