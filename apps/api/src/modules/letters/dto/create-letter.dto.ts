import { IsDateString, IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateLetterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  recipientName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content: string;

  @IsDateString()
  sendAt: string;
}
