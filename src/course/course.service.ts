import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
  ) {}

  async findCourseById(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async findAvilableCourses() {
    const courses = await this.prisma.course.findMany();
    return courses;
  }

  async findUserCourses(userId: number) {
    const purchses = await this.paymentService.findUserPurchases(userId);
    return this.prisma.course.findMany({
      where: {
        id: {
          in: purchses.map((purchse) => purchse.courseId),
        },
      },
    });
  }

  async createCourse(createCourseInput: Prisma.CourseCreateInput) {
    return await this.prisma.course.create({
      data: createCourseInput,
    });
  }

  async updateCourse(id: number, updateCourseInput: Prisma.CourseUpdateInput) {
    try {
      const updatedCourse = await this.prisma.course.update({
        where: { id },
        data: updateCourseInput,
      });
      return updatedCourse;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Cannot update course');
      }
    }
  }

  async deleteCourse(id: number) {
    try {
      await this.prisma.course.delete({
        where: { id },
      });
      return { message: 'Course deleted successfully' };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Cannot delete course');
      }
    }
  }

  async purchaseCourse(id: number, userId: number) {
    const course = await this.findCourseById(id);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    return await this.paymentService.purchaseCourse({
      courseId: id,
      userId,
    });
  }

  async verifyUserPurchase(courseId: number, userId: number) {
    const course = await this.findCourseById(courseId);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    return await this.paymentService.verifyUserPurchase(courseId, userId);
  }

  async findCourseContents(id: number) {
    const course = await this.findCourseById(id);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    return await this.prisma.content.findMany({
      where: {
        courseId: id,
      },
    });
  }

  async createCourseContent(
    id: number,
    createCourseContentInput: Prisma.ContentCreateInput,
  ) {
    const course = await this.findCourseById(id);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    return await this.prisma.content.create({
      data: createCourseContentInput,
    });
  }

  async findCourseContentById(id: number, contentId: number) {
    const course = await this.findCourseById(id);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    return await this.prisma.content.findUnique({
      where: {
        id: contentId,
      },
    });
  }

  async updateCourseContent(
    id: number,
    contentId: number,
    updateCourseContentInput: Prisma.ContentUpdateInput,
  ) {
    const course = await this.findCourseById(id);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    return await this.prisma.content.update({
      where: {
        id: contentId,
      },
      data: updateCourseContentInput,
    });
  }

  async deleteCourseContent(id: number, contentId: number) {
    const course = await this.findCourseById(id);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    return await this.prisma.content.delete({
      where: {
        id: contentId,
      },
    });
  }
}