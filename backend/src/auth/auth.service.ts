import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { User } from './interfaces/user.interface';
import { OidcUserDto } from './dto/oidc-user.dto';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly users: Map<string, User> = new Map(); // In-memory storage

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Find or create user from OAuth provider (BeProduct)
   * Auto-registers new users
   */
  async findOrCreateOidcUser(oidcUser: OidcUserDto): Promise<User> {
    // Check if user exists by externalId (BeProduct sub)
    let user = Array.from(this.users.values()).find(
      (u) => u.externalId === oidcUser.externalId && u.provider === oidcUser.provider,
    );

    if (user) {
      // Update existing user
      this.logger.log(`Updating existing user: ${user.email}`);
      user.email = oidcUser.email;
      user.name = oidcUser.name;
      user.firstName = oidcUser.firstName;
      user.lastName = oidcUser.lastName;
      user.company = oidcUser.company;
      user.locale = oidcUser.locale;
      user.emailVerified = oidcUser.emailVerified;
      user.lastLoginAt = new Date();
      this.users.set(user.id, user);
      return user;
    }

    // Check if user exists by email (for linking accounts)
    user = Array.from(this.users.values()).find(
      (u) => u.email === oidcUser.email,
    );

    if (user) {
      // Link existing email user to OAuth provider
      this.logger.log(`Linking existing email user to OAuth: ${user.email}`);
      user.externalId = oidcUser.externalId;
      user.provider = oidcUser.provider;
      user.name = oidcUser.name;
      user.firstName = oidcUser.firstName;
      user.lastName = oidcUser.lastName;
      user.company = oidcUser.company;
      user.locale = oidcUser.locale;
      user.emailVerified = oidcUser.emailVerified;
      user.lastLoginAt = new Date();
      this.users.set(user.id, user);
      return user;
    }

    // Create new user (auto-registration)
    this.logger.log(`Creating new user from OAuth: ${oidcUser.email}`);
    const newUser: User = {
      id: uuidv4(),
      externalId: oidcUser.externalId,
      email: oidcUser.email,
      name: oidcUser.name,
      firstName: oidcUser.firstName,
      lastName: oidcUser.lastName,
      company: oidcUser.company,
      locale: oidcUser.locale,
      emailVerified: oidcUser.emailVerified,
      provider: oidcUser.provider,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    this.users.set(newUser.id, newUser);
    return newUser;
  }

  /**
   * Find user by ID
   */
  async findById(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  /**
   * Generate JWT access token
   */
  generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      externalId: user.externalId,
      email: user.email,
      name: user.name,
      company: user.company,
      locale: user.locale,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Get all users (for debugging)
   */
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}
