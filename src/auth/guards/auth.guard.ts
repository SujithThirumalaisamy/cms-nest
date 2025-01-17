import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException();
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: 'supersecuresecret',
        maxAge: '1d',
      });

      if (!decoded.sub) {
        throw new UnauthorizedException();
      }

      request.user = {
        userId: decoded.sub,
        username: decoded.name,
      };
    } catch (error) {
      if (error instanceof JsonWebTokenError) throw new UnauthorizedException();
    }

    return true;
  }
}
