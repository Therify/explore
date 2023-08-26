import { Controller, Get, Param } from '@nestjs/common';

import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService
  ) {}
  @Get('plus-one/:num')
  async plusOne(@Param('num') num: number): Promise<void> {
    const res = await this.prisma.$queryRaw`select 1 + ${num}::int as result`;
    console.info(res);
  }
  @Get()
  getData() {
    return this.appService.getData();
  }
}
