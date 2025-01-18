import { IsNotEmpty, IsNumber } from 'class-validator';

export class PurchaseCreateDto {
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
