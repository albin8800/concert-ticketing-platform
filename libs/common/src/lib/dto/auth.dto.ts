import { IsEmail, IsISO8601, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Invalid email address' })
    email!: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password!: string;

    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    @IsString()
    phoneNumber!: string;

    @IsISO8601()
    dateOfBirth!: string;
}

export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;

}

export class GenerateTokenDto {
    @IsString()
    userId!: string;
}