import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [AuthModule, CourseModule],
})
export class AppModule {}
