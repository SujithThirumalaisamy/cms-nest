import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

type AuthInput = {
  name: string;
  password: string;
};

type SignInData = {
  id: number;
  name: string;
};

type AuthResult = {
  name: string;
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(input: AuthInput): Promise<SignInData> {
    const user = await this.userService.user({
      name: input.name,
    });
    if (user && user.password === input.password) {
      return {
        id: user.id,
        name: user.name,
      };
    }
    return null;
  }

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = { sub: user.id, name: user.name };
    const token = this.jwtService.sign(tokenPayload);
    return {
      name: user.name,
      accessToken: token,
    };
  }

  async signOut() {
    return { message: 'Signed out' };
  }
}
