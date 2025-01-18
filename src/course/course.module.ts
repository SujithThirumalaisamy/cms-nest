import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { PrismaService } from 'src/prisma.service';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaService, PaymentService],
})
export class CourseModule {}
