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
      passReqToCallback: false,
    });
  }

  async validate(
    issuer: string,
    profile: BeProductProfile,
    context: any,
    idToken: string,
    accessToken: string,
    refreshToken: string,
    done: (err: any, user?: any) => void,
  ): Promise<any> {
    try {
      const profileData = profile._json;

      // Parse BeProduct-specific userinfo JSON string
      let userInfo: BeProductUserInfo = {
        FirstName: '',
        LastName: '',
        Culture: 'en',
      };

      try {
        if (profileData.userinfo) {
          userInfo = JSON.parse(profileData.userinfo);
        }
      } catch (error) {
        console.error('Failed to parse userinfo JSON:', error);
      }

      // Build full name from FirstName + LastName
      const fullName =
        userInfo.FirstName && userInfo.LastName
          ? `${userInfo.FirstName} ${userInfo.LastName}`.trim()
          : profileData.preferred_username || profileData.email;

      // Map BeProduct profile to internal user format
      const oidcUser: OidcUserDto = {
        externalId: profileData.sub,
        email: profileData.email,
        name: fullName,
        firstName: userInfo.FirstName,
        lastName: userInfo.LastName,
        emailVerified: profileData.email_verified || false,
        locale: userInfo.Culture || 'en',
        company: profileData.company,
        provider: 'beproduct-oidc',
        accessToken: '', // Not stored for security
        refreshToken: '', // Not stored for security
      };

      // Create or update user via AuthService
      const user = await this.authService.findOrCreateOidcUser(oidcUser);

      return done(null, user);
    } catch (error) {
      console.error('BeProduct OIDC validation error:', error);
      return done(error, null);
    }
  }
}
