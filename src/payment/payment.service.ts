import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async purchaseCourse(createPaymentInput: Prisma.PurchaseCreateInput) {
    return await this.prisma.purchase.create({
      data: createPaymentInput,
    });
  }

  async findUserPurchases(userId: number) {
    return await this.prisma.purchase.findMany({
      where: { userId },
    });
  }

  async verifyUserPurchase(courseId: number, userId: number) {
    const purchase = await this.prisma.purchase.findFirst({
      where: { courseId, userId },
    });
    if (purchase) {
      return true;
    }

    return false;
  }
}
