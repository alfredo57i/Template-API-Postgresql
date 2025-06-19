import { IsString, IsArray, ArrayNotEmpty, ValidateNested, IsNumber, Min,} from 'class-validator';
import { Type } from 'class-transformer';

class ConstantItemDto {
  @IsNumber()
  @Min(1)
  id: number;

  @IsString()
  value: string;
}

export class CreateConstantListDto {
  @IsString()
  key: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ConstantItemDto)
  values: ConstantItemDto[];
}
