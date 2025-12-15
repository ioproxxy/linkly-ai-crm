import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatHistoryItemDto {
  @IsString()
  @IsNotEmpty()
  role!: 'user' | 'model';

  @IsString()
  @IsNotEmpty()
  text!: string;
}

export class ChatCommandDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsArray()
  @IsOptional()
  history?: ChatHistoryItemDto[];
}
