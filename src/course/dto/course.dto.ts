import { ContentType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CourseCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsUrl()
  imageUrl: string;

  @IsString()
  description: string;
}

export class CourseUpdateDto {
  @IsString()
  title: string;

  @IsString()
  imageUrl: string;

  @IsString()
  description: string;
}

export class CourseContentCreateDto {
  @IsEnum(ContentType)
  @IsOptional()
  type: ContentType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsUrl()
  thumbnail: string;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsNumber()
  @IsOptional()
  parentId: number;

  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsNumber()
  @IsOptional()
  videoMetadataId: number;
}

export class CourseContentUpdateDto {
  @IsEnum(ContentType)
  type: ContentType;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  thumbnail: string;

  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  parentId: number;

  @IsNumber()
  courseId: number;

  @IsNumber()
  videoMetadataId: number;
}
