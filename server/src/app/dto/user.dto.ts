import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;
}
