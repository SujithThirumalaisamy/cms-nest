import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SigninDto, SignupDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() createUserDto: SignupDto) {
    try {
      const user = await this.prisma.user.create({
        data: createUserDto,
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException();
      }
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @UsePipes(ValidationPipe)
  login(@Body() signinDto: SigninDto) {
    return this.authService.authenticate(signinDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  logout() {
    return this.authService.signOut();
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  me(@Request() req: { user: any }) {
    return req.user;
  }
}
