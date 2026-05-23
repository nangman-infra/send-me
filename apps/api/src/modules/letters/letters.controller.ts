import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { LettersService } from './letters.service';
import { CreateLetterDto } from './dto/create-letter.dto';

@Controller('api/v1/letters')
export class LettersController {
  constructor(private readonly lettersService: LettersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createLetter(@Body() dto: CreateLetterDto) {
    const data = await this.lettersService.createLetter(dto);
    return { success: true, data };
  }

  @Get('cancel/:token')
  async getCancelStatus(@Param('token') token: string) {
    const data = await this.lettersService.getCancelStatus(token);
    return { success: true, data };
  }

  @Delete('cancel/:token')
  @HttpCode(HttpStatus.OK)
  async cancelLetter(@Param('token') token: string) {
    await this.lettersService.cancelLetter(token);
    return { success: true, data: null };
  }
}
