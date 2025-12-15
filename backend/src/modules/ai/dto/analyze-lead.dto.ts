import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyzeLeadDto {
  @IsString()
  @IsNotEmpty()
  leadId!: string;
}
