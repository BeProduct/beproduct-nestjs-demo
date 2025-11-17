import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy as OpenIDConnectStrategy } from 'passport-openidconnect';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';

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

    // Override the _verify function to capture tokens
    const originalVerify = (this as any)._verify.bind(this);
    (this as any)._verify = function (
      issuer: string,
      profile: any,
      context: any,
      idToken: string,
      accessToken: string,
      refreshToken: string,
      done: (error: any, user?: any) => void,
    ) {
      console.log('=== CUSTOM _VERIFY CALLED ===');
      console.log('Total arguments:', arguments.length);
      console.log('Access token:', accessToken ? 'YES' : 'NO');
      console.log('Refresh token:', refreshToken ? 'YES' : 'NO');

      authService
        .validateOidcUser(profile, accessToken, refreshToken)
        .then((user) => {
          console.log('User validated successfully, calling done');
          done(null, user);
        })
        .catch((error) => {
          console.error('Validation error:', error);
          done(error);
        });
    };
  }

  async validate(profile: any): Promise<any> {
    // This gets called by NestJS PassportStrategy wrapper
    // but we've overridden _verify so this may not be used
    return profile;
  }
}
