import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { User } from './interfaces/user.interface';

// Internal DTOs for auth service
interface OidcUserDto {
  externalId: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  locale: string;
  company: string;
  provider: string;
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  sub: string;
  externalId: string;
  email: string;
  name: string;
  company?: string;
  locale?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly users: Map<string, User> = new Map(); // In-memory storage

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Validate OIDC user and return user object with tokens
   */
  async validateOidcUser(
    profile: any,
    accessToken: string,
    refreshToken: string,
  ): Promise<User> {
    console.log('BeProduct profile received:', JSON.stringify(profile, null, 2));

    // Extract email from emails array
    const email = profile.emails && profile.emails.length > 0
      ? profile.emails[0].value
      : null;

    if (!email) {
      throw new Error('No email found in BeProduct profile');
    }

    // Use username as name if available
    const name = profile.username || profile.displayName || email.split('@')[0];

    // Map BeProduct profile to internal user format
    const oidcUser: OidcUserDto = {
      externalId: profile.id,
      email: email,
      name: name,
      firstName: '',
      lastName: '',
      emailVerified: true,
      locale: 'en',
      company: '', // Company field not available in BeProduct profile
      provider: 'beproduct-oidc',
      accessToken: accessToken || '',
      refreshToken: refreshToken || '',
    };

    console.log('Mapped OIDC user:', oidcUser);

    // Create or update user via existing method
    const user = await this.findOrCreateOidcUser(oidcUser);

    console.log('User created/updated:', user);

    return user;
  }

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
      user.accessToken = oidcUser.accessToken;
      user.refreshToken = oidcUser.refreshToken;
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
      user.accessToken = oidcUser.accessToken;
      user.refreshToken = oidcUser.refreshToken;
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
      accessToken: oidcUser.accessToken,
      refreshToken: oidcUser.refreshToken,
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
   * Generate JWT access token (WITHOUT BeProduct tokens to keep it small)
   */
  generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      externalId: user.externalId,
      email: user.email,
      name: user.name,
      company: user.company,
      locale: user.locale,
      // NOTE: BeProduct tokens NOT included - keeps JWT small (~200 bytes)
      // Tokens are fetched from storage via /auth/me endpoint
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
