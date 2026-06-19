import { IsEmail, IsISO8601, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Invalid email address' })
    email!: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password!: string;

    @IsString()
    firstName!: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    phoneNumber!: string;

    @IsISO8601()
    dateOfBirth!: string;
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

}

export class GenerateTokenDto {
    @IsString()
    userId!: string;

    @IsString()
    @IsNotEmpty()
    role!: string;
}

export class RefreshDto {
    @IsString()
    @IsNotEmpty()
    refreshToken!: string;
}

export class CreateRefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    userId!: string;
}