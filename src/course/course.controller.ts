import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

//Fix this only we have proper validation pipelines
type Req = {
  user: {
    userId: number;
    username: string;
  };
  body: any;
  params: any;
};

@UseGuards(AuthGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  getCourses(@Request() req: Req) {
    return this.courseService.findUserCourses(req.user.userId);
  }

  @UseGuards(AdminGuard)
  @Post()
  createCourse(@Request() req: Req) {
    return this.courseService.createCourse(req.body);
  }

  @Get(':id')
  async getCourseById(@Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.findCourseById(courseId);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  updateCourse(
    @Request() req: Req,
    @Param('id', ParseIntPipe) courseId: number,
  ) {
    return this.courseService.updateCourse(courseId, req.body);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteCourse(@Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.deleteCourse(courseId);
  }

  @Get(':id/content')
  async getCourseContentsById(
    @Param('id', ParseIntPipe) courseId: number,
    @Request() req: Req,
  ) {
    const verifyPurchase = await this.courseService.verifyUserPurchase(
      courseId,
      req.user.userId,
    );
    if (!verifyPurchase) {
      throw new ForbiddenException('Unable to access non purchased content');
    }
    return this.courseService.findCourseContents(courseId);
  }

  @UseGuards(AdminGuard)
  @Post(':id/content')
  createCourseContent(
    @Param('id', ParseIntPipe) courseId: number,
    @Request() req: Req,
  ) {
    return this.courseService.createCourseContent(courseId, req.body);
  }

  @Get(':id/content/:contentId')
  async getCourseContentById(
    @Param('id', ParseIntPipe) courseId: number,
    @Param('contentId', ParseIntPipe) contentId: number,
  ) {
    return this.courseService.findCourseContentById(courseId, contentId);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/content/:contentId')
  updateCourseContent(
    @Param('id', ParseIntPipe) courseId: number,
    @Param('contentId', ParseIntPipe) contentId: number,
    @Request() req: Req,
  ) {
    return this.courseService.updateCourseContent(
      courseId,
      contentId,
      req.body,
    );
  }

  @UseGuards(AdminGuard)
  @Delete(':id/content/:contentId')
  async deleteCourseContent(
    @Param('id', ParseIntPipe) courseId: number,
    @Param('contentId', ParseIntPipe) contentId: number,
  ) {
    return this.courseService.deleteCourseContent(courseId, contentId);
  }

  @Post('purchase')
  purchaseCourse(
    @Request() req: Req,
    @Body('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.courseService.purchaseCourse(courseId, req.user.userId);
  }
}
