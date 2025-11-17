import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { User } from './interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  /**
   * Initiate BeProduct OAuth flow
   * Redirects to BeProduct IDS authorization page
   */
  @Get('beproduct')
  @UseGuards(AuthGuard('beproduct-oidc'))
  async oidcLogin() {
    // Guard handles redirect to BeProduct IDS
  }

  /**
   * OAuth callback endpoint
   * Handles response from BeProduct IDS
   */
  @Get('callback/beproduct')
  @UseGuards(AuthGuard('beproduct-oidc'))
  async oidcCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;

    if (!user) {
      // Redirect to login with error
      const frontendUrl = this.configService.get('FRONTEND_URL');
      return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }

    // Generate small JWT token (does NOT include BeProduct tokens)
    const token = this.authService.generateAccessToken(user);

    // Set httpOnly cookie with JWT
    this.setAuthCookie(res, token);

    // Redirect to frontend dashboard
    const frontendUrl = this.configService.get('FRONTEND_URL');
    return res.redirect(`${frontendUrl}/dashboard`);
  }

  /**
   * Get current user from JWT
   * Protected route - requires authentication
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@Req() req: Request) {
    const jwtUser = req.user as any;

    // Fetch full user from storage (includes BeProduct accessToken/refreshToken)
    const fullUser = await this.authService.findById(jwtUser.id);

    if (!fullUser) {
      return jwtUser; // Fallback to JWT data if user not found
    }

    return fullUser;
  }

  /**
   * Logout user
   * Clears auth cookie
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response) {
    this.clearAuthCookie(res);
    return res.json({ message: 'Logged out successfully' });
  }

  /**
   * Set auth cookie (httpOnly for security)
   */
  private setAuthCookie(res: Response, token: string) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const expiresIn = this.configService.get('JWT_EXPIRATION') || '30d';

    // Convert JWT_EXPIRATION to milliseconds
    const expirationMs = this.parseExpiration(expiresIn);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: expirationMs,
    });
  }

  /**
   * Clear auth cookie
   */
  private clearAuthCookie(res: Response) {
    res.clearCookie('authToken', {
      httpOnly: true,
      path: '/',
    });
  }

  /**
   * Parse expiration string (e.g., '30d', '7d') to milliseconds
   */
  private parseExpiration(expiration: string): number {
    const match = expiration.match(/^(\d+)([dhms])$/);
    if (!match) {
      return 30 * 24 * 60 * 60 * 1000; // Default 30 days
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'm':
        return value * 60 * 1000;
      case 's':
        return value * 1000;
      default:
        return 30 * 24 * 60 * 60 * 1000;
    }
  }
}
