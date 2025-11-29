import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ description: 'Post title' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Post description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'User ID' })
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Banner image file',
  })
  @IsOptional()
  banner?: any;
}
