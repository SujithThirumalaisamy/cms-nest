import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminGuard {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.user;

    const user = await this.usersService.user({ id: userId });

    if (!user) {
      throw new ForbiddenException();
    }

    if (!user.isAdmin) {
      throw new ForbiddenException();
    }

    return true;
  }
}
