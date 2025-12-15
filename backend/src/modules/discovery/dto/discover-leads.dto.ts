import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class DiscoverLeadsDto {
  @IsArray()
  @IsString({ each: true })
  keywords!: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
