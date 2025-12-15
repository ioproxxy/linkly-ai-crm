import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AppLogger } from '../logging/logging.service';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly logger: AppLogger,
  ) {}

  async register(payload: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      this.logger.warn(`Attempted duplicate registration for ${payload.email}`, AuthService.name);
      throw new ConflictException('Account already exists');
    }

    const passwordHash = await bcrypt.hash(payload.password, this.SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: payload.email,
        password: passwordHash,
        name: payload.name,
        organization: payload.organization,
      },
    });

    this.logger.log(`User registered ${user.id}`, AuthService.name);

    return this.buildAuthResponse(user.id, user.email, user.name, user.organization);
  }

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      this.logger.warn(`Login failed for ${payload.email}`, AuthService.name);
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(payload.password, user.password);
    if (!valid) {
      this.logger.warn(`Login failed (bad password) for ${payload.email}`, AuthService.name);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in ${user.id}`, AuthService.name);

    return this.buildAuthResponse(user.id, user.email, user.name, user.organization);
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  private buildAuthResponse(id: string, email: string, name: string, organization: string) {
    const payload = { sub: id, email };

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    return {
      user: { id, email, name, organization },
      accessToken,
    };
  }
}
