import { Type } from "class-transformer";
import { IsIn, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";

export class PaginationDTO {
    @IsOptional()
    @IsPositive()
    @Min(1)
    @Max(20)
    @Type(() => Number)
    size?: number;

    @IsOptional()
    @IsPositive()
    @Min(1)
    page?: number;

    @IsOptional()
    @IsString()
    @IsIn(['title', 'price', 'createdAt'])
    orderBy?: string;
  
    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC'])
    orderDirection?: 'ASC' | 'DESC';

}