import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BeProductAuthModule } from '@beproduct/nestjs-auth';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    BeProductAuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        issuer: configService.get<string>('OIDC_ISSUER')!,
        authorizationURL: configService.get<string>('OIDC_AUTHORIZATION_URL')!,
        tokenURL: configService.get<string>('OIDC_TOKEN_URL')!,
        userInfoURL: configService.get<string>('OIDC_USERINFO_URL')!,
        clientID: configService.get<string>('OIDC_CLIENT_ID')!,
        clientSecret: configService.get<string>('OIDC_CLIENT_SECRET')!,
        callbackURL: configService.get<string>('OIDC_CALLBACK_URL')!,
        scope: configService.get<string>('OIDC_SCOPES')!.split(' '),
        jwtSecret: configService.get<string>('JWT_SECRET')!,
        jwtExpiration: configService.get<string>('JWT_EXPIRATION') || '30d',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
