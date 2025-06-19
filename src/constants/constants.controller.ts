import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConstantsService } from './constants.service';
import { CreateConstantListDto } from './dto/create-constant.dto';

@Controller('constants')
export class ConstantsController {
  constructor(private readonly constantsService: ConstantsService) {}

  @Get()
  getAll() {
    return this.constantsService.findAllGrouped();
  }

  @Post()
  add(@Body() body: CreateConstantListDto) {
    return this.constantsService.addConstants(body.key, body.values);
  }
}