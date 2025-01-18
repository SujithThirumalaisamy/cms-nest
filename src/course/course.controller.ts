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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import {
  CourseContentCreateDto,
  CourseContentUpdateDto,
  CourseCreateDto,
  CourseUpdateDto,
} from './dto/course.dto';

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
  @UsePipes(ValidationPipe)
  @Post()
  createCourse(@Body() body: CourseCreateDto) {
    return this.courseService.createCourse(body);
  }

  @Get(':id')
  async getCourseById(@Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.findCourseById(courseId);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  updateCourse(
    @Body() body: CourseUpdateDto,
    @Param('id', ParseIntPipe) courseId: number,
  ) {
    return this.courseService.updateCourse(courseId, body);
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
  @UsePipes(ValidationPipe)
  createCourseContent(
    @Param('id', ParseIntPipe) courseId: number,
    @Body() body: CourseContentCreateDto,
  ) {
    return this.courseService.createCourseContent(courseId, body);
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
    @Body() body: CourseContentUpdateDto,
  ) {
    return this.courseService.updateCourseContent(courseId, contentId, body);
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
