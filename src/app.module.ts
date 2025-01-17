import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CourseService } from './course/course.service';
import { CourseModule } from './course/course.module';
import { PaymentService } from './payment/payment.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule, CourseModule],
  providers: [CourseService, PaymentService, PrismaService],
})
export class AppModule {}
