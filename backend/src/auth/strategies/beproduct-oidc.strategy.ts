import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as OpenIDConnectStrategy } from 'passport-openidconnect';
import { AuthService } from '../auth.service';
import { OidcUserDto } from '../dto/oidc-user.dto';

interface BeProductProfile {
  _json: {
    sub: string;
    preferred_username: string;
    email: string;
    email_verified: boolean;
    company: string;
    userinfo: string; // JSON string: {FirstName, LastName, Culture}
  };
  emails?: Array<{ value: string; verified?: boolean }>;
}

interface BeProductUserInfo {
  FirstName: string;
  LastName: string;
  Culture: string;
}

@Injectable()
export class BeProductOidcStrategy extends PassportStrategy(
  OpenIDConnectStrategy,
  'beproduct-oidc',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      issuer: configService.get<string>('OIDC_ISSUER')!,
      authorizationURL: configService.get<string>('OIDC_AUTHORIZATION_URL')!,
      tokenURL: configService.get<string>('OIDC_TOKEN_URL')!,
      userInfoURL: configService.get<string>('OIDC_USERINFO_URL')!,
      clientID: configService.get<string>('OIDC_CLIENT_ID')!,
      clientSecret: configService.get<string>('OIDC_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('OIDC_CALLBACK_URL')!,
      scope: configService.get<string>('OIDC_SCOPES')!.split(' '),
      skipUserProfile: false,
      passReqToCallback: true, // Enable request in callback to access tokens
    });
  }

  async validate(
    req: any,
    issuer: string,
    profile: any,
    context: any,
    idToken: string,
    accessToken: string,
    refreshToken: string,
    done: any,
  ): Promise<any> {
    console.log('=== VALIDATE CALLED WITH passReqToCallback ===');
    console.log('Total arguments:', arguments.length);
    console.log('Access token (arg 5):', accessToken ? 'YES' : 'NO');
    console.log('Refresh token (arg 6):', refreshToken ? 'YES' : 'NO');

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

    // Create or update user via AuthService
    const user = await this.authService.findOrCreateOidcUser(oidcUser);

    console.log('User created/updated:', user);

    return user;
  }
}
