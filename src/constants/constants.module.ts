import { Module } from '@nestjs/common';
import { ConstantsService } from './constants.service';
import { ConstantsController } from './constants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Constant } from './entities/constant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Constant]),
  ],
  controllers: [ConstantsController],
  providers: [ConstantsService],
})
export class ConstantsModule {}
